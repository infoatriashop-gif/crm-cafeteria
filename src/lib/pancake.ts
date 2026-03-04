// Integración con Pancake POS/CRM API
// Docs: https://api-docs.pancake.vn/
// Base URL POS: https://pos.pages.fm/api/v1
//
// ARQUITECTURA DE COMUNICACIÓN:
// - Pancake POS API (este módulo): clientes, notas, CRM tables, webhooks
// - Pancake Pages Inbox (UI): WhatsApp, Instagram, Messenger, TikTok
//   → No tiene API pública para enviar mensajes; el admin responde desde su inbox
//   → El campo conversation_link del cliente abre esa conversación directamente
//
// FLUJO:
// 1. Cliente reserva → se crea/sincroniza en Pancake POS + nota de reserva
// 2. Pancake muestra el cliente con su historial al admin
// 3. Admin responde por WhatsApp/Instagram/etc. desde Pancake Inbox
// 4. Webhooks de Pancake notifican a esta app cuando hay cambios

import { obtenerConfigRuntime, pancakeEstaConfigurado } from "@/lib/config-runtime";

const BASE_URL = "https://pos.pages.fm/api/v1";

// Nombre de la tabla CRM donde guardamos las reservas en Pancake
const CRM_TABLE_RESERVAS = "reservas_cafeteria";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface ClientePancake {
  id: number;
  name: string;
  phone_numbers: string[];
  emails: string[];
  gender?: string;
  date_of_birth?: string;
  reward_point?: number;
  tags?: string[];
  order_count?: number;
  purchased_amount?: number;
  succeed_order_count?: number;
  last_order_at?: number;
  /** Enlace directo a la conversación del cliente en Pancake Inbox (WhatsApp/etc.) */
  conversation_link?: string;
  notes?: NotaPancake[];
}

export interface NotaPancake {
  id?: number;
  message: string;
  images?: string[];
  order_id?: number;
}

export interface RespuestaListaClientes {
  data: ClientePancake[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface DatosReservaParaPancake {
  nombre: string;
  telefono: string;
  email?: string;
  fecha: string;         // "YYYY-MM-DD"
  hora: string;          // "HH:MM"
  personas: number;
  mesa: string;          // ej. "Mesa 3 — Interior"
  idReserva: string;     // ej. "RES-84729"
  notasEspeciales?: string;
}

export interface ResultadoRegistroReserva {
  ok: boolean;
  clienteId: number | null;
  /** Enlace directo al chat del cliente en Pancake Inbox */
  conversationLink?: string;
}

// ─── Cliente HTTP interno ────────────────────────────────────────────────────

async function llamarAPI<T>(
  metodo: "GET" | "POST" | "PUT",
  ruta: string,
  cuerpo?: unknown
): Promise<T | null> {
  if (!pancakeEstaConfigurado()) {
    console.warn("[Pancake] No configurado. Omitiendo.");
    return null;
  }

  const { pancakeApiKey } = obtenerConfigRuntime();
  const url = new URL(`${BASE_URL}${ruta}`);
  url.searchParams.set("api_key", pancakeApiKey);

  try {
    const res = await fetch(url.toString(), {
      method: metodo,
      headers: cuerpo ? { "Content-Type": "application/json" } : {},
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const texto = await res.text().catch(() => "");
      console.error(`[Pancake] Error ${res.status} en ${metodo} ${ruta}:`, texto.slice(0, 200));
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error(`[Pancake] Error de red en ${metodo} ${ruta}:`, err);
    return null;
  }
}

function shopRuta(sufijo: string): string {
  const { pancakeShopId } = obtenerConfigRuntime();
  return `/shops/${pancakeShopId}${sufijo}`;
}

// ─── Clientes ────────────────────────────────────────────────────────────────

export async function buscarClientePorTelefono(
  telefono: string
): Promise<ClientePancake | null> {
  const respuesta = await llamarAPI<RespuestaListaClientes>(
    "GET",
    shopRuta(`/customers?search=${encodeURIComponent(telefono)}&page_size=5`)
  );
  if (!respuesta?.data?.length) return null;

  const exacto = respuesta.data.find((c) =>
    c.phone_numbers?.some((p) => p.replace(/\D/g, "") === telefono.replace(/\D/g, ""))
  );
  return exacto ?? respuesta.data[0];
}

export async function crearCliente(datos: {
  nombre: string;
  telefono: string;
  email?: string;
}): Promise<ClientePancake | null> {
  interface RespuestaCliente { data: ClientePancake }
  const respuesta = await llamarAPI<RespuestaCliente>("POST", shopRuta("/customers"), {
    name: datos.nombre,
    phoneNumber: datos.telefono,
    createType: "force",
  });
  return respuesta?.data ?? null;
}

export async function actualizarCliente(
  clienteId: number,
  datos: Partial<ClientePancake>
): Promise<boolean> {
  const respuesta = await llamarAPI("PUT", shopRuta(`/customers/${clienteId}`), { customer: datos });
  return respuesta !== null;
}

/** Busca el cliente por teléfono; si no existe, lo crea (upsert). */
export async function sincronizarCliente(datos: {
  nombre: string;
  telefono: string;
  email?: string;
}): Promise<ClientePancake | null> {
  const existente = await buscarClientePorTelefono(datos.telefono);

  if (existente) {
    if (datos.email && !existente.emails?.includes(datos.email)) {
      await actualizarCliente(existente.id, {
        emails: [...(existente.emails ?? []), datos.email],
      });
    }
    return existente;
  }

  return await crearCliente(datos);
}

// ─── Notas ───────────────────────────────────────────────────────────────────

export async function agregarNotaACliente(
  clienteId: number,
  mensaje: string
): Promise<boolean> {
  const respuesta = await llamarAPI(
    "POST",
    shopRuta(`/customers/${clienteId}/create_note`),
    { message: mensaje }
  );
  return respuesta !== null;
}

// ─── CRM Table: Reservas ─────────────────────────────────────────────────────

/**
 * Asegura que exista la tabla "reservas_cafeteria" en el CRM de Pancake.
 * Si ya existe, Pancake devuelve error 422/409 — lo ignoramos.
 */
export async function asegurarTablaCRM(): Promise<void> {
  await llamarAPI("POST", shopRuta("/crm/tables"), {
    table: {
      name: CRM_TABLE_RESERVAS,
      label: "Reservas Cafetería",
    },
  });
  // No verificamos el resultado: si ya existe, simplemente continúa
}

/**
 * Guarda una reserva como registro en la tabla CRM de Pancake.
 * Esto permite al admin ver todas las reservas directamente en Pancake.
 */
export async function guardarReservaEnCRM(
  datos: DatosReservaParaPancake,
  clienteId: number
): Promise<boolean> {
  interface RespuestaCRM { data?: { record?: unknown; success?: boolean } }
  const respuesta = await llamarAPI<RespuestaCRM>(
    "POST",
    shopRuta(`/crm/${CRM_TABLE_RESERVAS}/records`),
    {
      record: {
        id_reserva: datos.idReserva,
        cliente: datos.nombre,
        telefono: datos.telefono,
        email: datos.email ?? "",
        fecha: datos.fecha,
        hora: datos.hora,
        personas: datos.personas,
        mesa: datos.mesa,
        notas: datos.notasEspeciales ?? "",
        cliente_id: clienteId,
        estado: "pendiente",
        creada_en: new Date().toISOString(),
      },
    }
  );
  return respuesta?.data?.success ?? respuesta !== null;
}

// ─── Webhook ─────────────────────────────────────────────────────────────────

/**
 * Configura el webhook de Pancake para que notifique a esta app
 * cuando se creen/actualicen clientes u órdenes.
 */
export async function configurarWebhook(webhookUrl: string): Promise<boolean> {
  const respuesta = await llamarAPI("PUT", shopRuta(""), {
    shop: {
      webhook_enable: true,
      webhook_url: webhookUrl,
      webhook_types: ["orders", "customers"],
    },
  });
  return respuesta !== null;
}

export async function desactivarWebhook(): Promise<boolean> {
  const respuesta = await llamarAPI("PUT", shopRuta(""), {
    shop: { webhook_enable: false },
  });
  return respuesta !== null;
}

// ─── Función principal ───────────────────────────────────────────────────────

/**
 * Registra una reserva en Pancake CRM completo:
 * 1. Sincroniza el cliente (crea o actualiza)
 * 2. Agrega una nota al cliente con los detalles de la reserva
 * 3. Guarda la reserva como registro en la tabla CRM "reservas_cafeteria"
 *
 * Retorna el clienteId y el conversation_link si el cliente ya tiene
 * conversaciones en Pancake Inbox (WhatsApp, Instagram, Messenger, TikTok).
 * El admin puede usar ese enlace para ir directamente al chat del cliente.
 *
 * Esta función nunca lanza errores — si Pancake falla, la reserva se confirma igual.
 */
export async function registrarReservaEnPancake(
  datos: DatosReservaParaPancake
): Promise<ResultadoRegistroReserva> {
  if (!pancakeEstaConfigurado()) {
    return { ok: false, clienteId: null };
  }

  try {
    const cliente = await sincronizarCliente({
      nombre: datos.nombre,
      telefono: datos.telefono,
      email: datos.email,
    });

    if (!cliente) return { ok: false, clienteId: null };

    // Ejecutar nota + CRM en paralelo
    await Promise.all([
      agregarNotaACliente(cliente.id, construirNota(datos)),
      guardarReservaEnCRM(datos, cliente.id),
    ]);

    return {
      ok: true,
      clienteId: cliente.id,
      // conversation_link existe si el cliente ya tiene chat abierto en Pancake
      conversationLink: cliente.conversation_link ?? undefined,
    };
  } catch (err) {
    console.error("[Pancake] Error en registrarReservaEnPancake:", err);
    return { ok: false, clienteId: null };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function construirNota(datos: DatosReservaParaPancake): string {
  const lineas = [
    `📅 Reserva ${datos.idReserva}`,
    `Fecha: ${datos.fecha} a las ${datos.hora}`,
    `Personas: ${datos.personas}`,
    `Mesa: ${datos.mesa}`,
  ];
  if (datos.notasEspeciales) lineas.push(`Notas: ${datos.notasEspeciales}`);
  return lineas.join("\n");
}
