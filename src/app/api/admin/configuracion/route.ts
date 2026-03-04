import { NextRequest, NextResponse } from "next/server";
import { obtenerConfigRuntime, actualizarConfigRuntime, pancakeEstaConfigurado } from "@/lib/config-runtime";

// GET /api/admin/configuracion — Devuelve la configuración actual (API key enmascarada)
export async function GET() {
  const config = obtenerConfigRuntime();
  return NextResponse.json({
    pancakeShopId: config.pancakeShopId,
    // Enmascarar la API key: solo mostrar los últimos 4 caracteres
    pancakeApiKeyPreview: config.pancakeApiKey
      ? `${"•".repeat(Math.max(0, config.pancakeApiKey.length - 4))}${config.pancakeApiKey.slice(-4)}`
      : "",
    configurado: pancakeEstaConfigurado(),
  });
}

// POST /api/admin/configuracion — Actualiza la configuración en runtime
export async function POST(request: NextRequest) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { pancakeApiKey, pancakeShopId } = cuerpo as Record<string, string>;

  if (typeof pancakeApiKey !== "string" || typeof pancakeShopId !== "string") {
    return NextResponse.json({ error: "pancakeApiKey y pancakeShopId son requeridos" }, { status: 422 });
  }

  actualizarConfigRuntime({
    pancakeApiKey: pancakeApiKey.trim(),
    pancakeShopId: pancakeShopId.trim(),
  });

  return NextResponse.json({ ok: true, configurado: pancakeEstaConfigurado() });
}
