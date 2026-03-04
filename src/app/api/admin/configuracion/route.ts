import { NextRequest, NextResponse } from "next/server";
import { obtenerConfigRuntime, actualizarConfigRuntime, pancakeEstaConfigurado } from "@/lib/config-runtime";
import { configurarWebhook, desactivarWebhook } from "@/lib/pancake";

// GET /api/admin/configuracion — Devuelve la configuración actual (API key enmascarada)
export async function GET() {
  const config = obtenerConfigRuntime();
  return NextResponse.json({
    pancakeShopId: config.pancakeShopId,
    pancakeApiKeyPreview: config.pancakeApiKey
      ? `${"•".repeat(Math.max(0, config.pancakeApiKey.length - 4))}${config.pancakeApiKey.slice(-4)}`
      : "",
    configurado: pancakeEstaConfigurado(),
  });
}

// POST /api/admin/configuracion — Actualiza credenciales Pancake en runtime
export async function POST(request: NextRequest) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { pancakeApiKey, pancakeShopId } = cuerpo as Record<string, string>;

  if (typeof pancakeApiKey !== "string" || typeof pancakeShopId !== "string") {
    return NextResponse.json(
      { error: "pancakeApiKey y pancakeShopId son requeridos" },
      { status: 422 }
    );
  }

  actualizarConfigRuntime({
    pancakeApiKey: pancakeApiKey.trim(),
    pancakeShopId: pancakeShopId.trim(),
  });

  return NextResponse.json({ ok: true, configurado: pancakeEstaConfigurado() });
}

// PUT /api/admin/configuracion — Configura o desactiva el webhook en Pancake
export async function PUT(request: NextRequest) {
  if (!pancakeEstaConfigurado()) {
    return NextResponse.json(
      { error: "Configura las credenciales de Pancake primero." },
      { status: 400 }
    );
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { accion, webhookUrl } = cuerpo as { accion: string; webhookUrl?: string };

  if (accion === "activar") {
    if (!webhookUrl) {
      return NextResponse.json({ error: "webhookUrl es requerido" }, { status: 422 });
    }
    const ok = await configurarWebhook(webhookUrl);
    return NextResponse.json({ ok, mensaje: ok ? "Webhook activado en Pancake" : "Error al configurar webhook" });
  }

  if (accion === "desactivar") {
    const ok = await desactivarWebhook();
    return NextResponse.json({ ok, mensaje: ok ? "Webhook desactivado" : "Error al desactivar webhook" });
  }

  return NextResponse.json({ error: "Acción no válida. Usa 'activar' o 'desactivar'" }, { status: 422 });
}
