// Integración con Pancake POS/CRM API
// Docs: https://api-docs.pancake.vn/
// Auth: api_key como query param en todas las peticiones
// Base URL: https://pos.pages.fm/api/v1

import { obtenerConfigRuntime, pancakeEstaConfigurado } from "@/lib/config-runtime";

const BASE_URL = "https://pos.pages.fm/api/v1";

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

// ─── Cliente HTTP interno ────────────────────────────────────────────────────

async function llamarAPI<T>(
  metodo: "GET" | "POST" | "PUT",
  ruta: string,
  cuerpo?: unknown
): Promise<T | null> {
  if (!pancakeEstaConfigurado()) {
    console.warn("[Pancake] No configurado (API key o Shop ID faltante). Omitiendo.");
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
      // Timeout de 8 segundos para no bloquear la respuesta al cliente
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

/**
 * Busca un cliente por número de teléfono.
 * Retorna el primero que coincida, o null si no existe.
 */
export async function buscarClientePorTelefono(
  telefono: string
): Promise<ClientePancake | null> {
  const respuesta = await llamarAPI<RespuestaListaClientes>(
    "GET",
    shopRuta(`/customers?search=${encodeURIComponent(telefono)}&page_size=5`)
  );
  if (!respuesta?.data?.length) return null;

  // Buscar coincidencia exacta de teléfono
  const exacto = respuesta.data.find((c) =>
    c.phone_numbers?.some((p) => p.replace(/\D/g, "") === telefono.replace(/\D/g, ""))
  );
  return exacto ?? respuesta.data[0];
}

/**
 * Crea un nuevo cliente en Pancake.
 */
export async function crearCliente(datos: {
  nombre: string;
  telefono: string;
  email?: string;
}): Promise<ClientePancake | null> {
  const cuerpo: Record<string, unknown> = {
    name: datos.nombre,
    phoneNumber: datos.telefono,
    createType: "force",
  };

  interface RespuestaCliente { data: ClientePancake }
  const respuesta = await llamarAPI<RespuestaCliente>("POST", shopRuta("/customers"), cuerpo);
  return respuesta?.data ?? null;
}

/**
 * Actualiza datos de un cliente existente (ej. agregar email).
 */
export async function actualizarCliente(
  clienteId: number,
  datos: Partial<ClientePancake>
): Promise<boolean> {
  const respuesta = await llamarAPI(
    "PUT",
    shopRuta(`/customers/${clienteId}`),
    { customer: datos }
  );
  return respuesta !== null;
}

/**
 * Busca un cliente por teléfono; si no existe, lo crea.
 * Retorna el cliente (existente o nuevo).
 */
export async function sincronizarCliente(datos: {
  nombre: string;
  telefono: string;
  email?: string;
}): Promise<ClientePancake | null> {
  const existente = await buscarClientePorTelefono(datos.telefono);

  if (existente) {
    // Si tiene email y el cliente no lo tiene registrado, actualizarlo
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

/**
 * Agrega una nota a un cliente (ej. detalles de su reserva).
 */
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

// ─── Función principal ───────────────────────────────────────────────────────

/**
 * Registra una reserva en Pancake CRM:
 * 1. Sincroniza el cliente (crea o actualiza)
 * 2. Agrega una nota con los detalles de la reserva
 *
 * Esta función nunca lanza errores — si Pancake falla, el flujo de reserva
 * continúa de todas formas.
 */
export async function registrarReservaEnPancake(
  datos: DatosReservaParaPancake
): Promise<{ clienteId: number | null; ok: boolean }> {
  if (!pancakeEstaConfigurado()) {
    return { clienteId: null, ok: false };
  }

  try {
    const cliente = await sincronizarCliente({
      nombre: datos.nombre,
      telefono: datos.telefono,
      email: datos.email,
    });

    if (!cliente) {
      return { clienteId: null, ok: false };
    }

    const nota = construirNota(datos);
    await agregarNotaACliente(cliente.id, nota);

    return { clienteId: cliente.id, ok: true };
  } catch (err) {
    console.error("[Pancake] Error inesperado en registrarReservaEnPancake:", err);
    return { clienteId: null, ok: false };
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
  if (datos.notasEspeciales) {
    lineas.push(`Notas: ${datos.notasEspeciales}`);
  }
  return lineas.join("\n");
}
