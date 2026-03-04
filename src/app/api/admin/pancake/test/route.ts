import { NextResponse } from "next/server";
import { obtenerConfigRuntime, pancakeEstaConfigurado } from "@/lib/config-runtime";

// GET /api/admin/pancake/test — Prueba la conexión con Pancake CRM
export async function GET() {
  if (!pancakeEstaConfigurado()) {
    return NextResponse.json(
      { ok: false, error: "Pancake no configurado. Ingresa la API Key y el Shop ID." },
      { status: 400 }
    );
  }

  const { pancakeApiKey, pancakeShopId } = obtenerConfigRuntime();

  try {
    const url = `https://pos.pages.fm/api/v1/shops/${pancakeShopId}/customers?page_size=1&api_key=${pancakeApiKey}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ ok: false, error: "API Key inválida o sin permisos." }, { status: 200 });
    }

    if (res.status === 404) {
      return NextResponse.json({ ok: false, error: "Shop ID no encontrado." }, { status: 200 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Error del servidor Pancake: ${res.status}` },
        { status: 200 }
      );
    }

    const datos = await res.json();
    const totalClientes: number = datos?.total ?? datos?.data?.length ?? 0;

    return NextResponse.json({
      ok: true,
      mensaje: "Conexión exitosa con Pancake CRM",
      shopId: pancakeShopId,
      totalClientes,
    });
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error de red";
    return NextResponse.json({ ok: false, error: `No se pudo conectar: ${mensaje}` }, { status: 200 });
  }
}
