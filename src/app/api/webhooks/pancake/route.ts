import { NextRequest, NextResponse } from "next/server";

// POST /api/webhooks/pancake
// Pancake envía notificaciones a este endpoint cuando:
// - Se crea o actualiza un cliente (p.ej. alguien que escribe por WhatsApp)
// - Se crea o actualiza una orden
//
// Para configurarlo: Pancake → Configuración → Webhook
// URL: https://tudominio.com/api/webhooks/pancake
//
// Tipos de eventos soportados:
// - customers: cliente creado/actualizado en Pancake (puede venir de WhatsApp, Instagram, etc.)
// - orders:    pedido creado/actualizado

interface PayloadWebhookCliente {
  id: number;
  name: string;
  phone_numbers: string[];
  emails: string[];
  conversation_link?: string;
  tags?: string[];
}

interface PayloadWebhookOrden {
  id: number;
  status: string;
  bill_full_name: string;
  bill_phone_number: string;
  conversation_id?: string;
  page_id?: string;
}

type PayloadWebhook =
  | { type: "customers"; data: PayloadWebhookCliente }
  | { type: "orders"; data: PayloadWebhookOrden }
  | { type: string; data: unknown };

export async function POST(request: NextRequest) {
  let payload: PayloadWebhook;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  console.log("[Webhook Pancake] Evento recibido:", payload.type);

  switch (payload.type) {
    case "customers": {
      const cliente = payload.data as PayloadWebhookCliente;
      console.log(`[Webhook Pancake] Cliente actualizado: ${cliente.name} (ID: ${cliente.id})`);

      if (cliente.conversation_link) {
        console.log(`[Webhook Pancake] → Tiene conversación activa: ${cliente.conversation_link}`);
        // TODO: cuando tengamos BD, actualizar reservas de este cliente
        //       con su conversation_link para mostrar en el panel
      }
      break;
    }

    case "orders": {
      const orden = payload.data as PayloadWebhookOrden;
      console.log(`[Webhook Pancake] Orden actualizada: ${orden.id} → estado: ${orden.status}`);
      // TODO: sincronizar estado de orden con reservas locales
      break;
    }

    default:
      console.log("[Webhook Pancake] Tipo de evento no manejado:", payload.type);
  }

  // Pancake espera un 200 rápido para confirmar recepción
  return NextResponse.json({ ok: true });
}

// GET — para que Pancake verifique que el endpoint existe
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "Pancake Webhook — Café Aroma",
    version: "1.0",
  });
}
