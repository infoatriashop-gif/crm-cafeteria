import { NextResponse } from "next/server";

// GET /api/reservas - Obtener reservas
export async function GET() {
  // TODO: Implementar consulta a base de datos
  return NextResponse.json({ reservas: [] });
}

// POST /api/reservas - Crear una reserva
export async function POST(request: Request) {
  const cuerpo = await request.json();

  // TODO: Validar con Zod y guardar en BD
  return NextResponse.json(
    { mensaje: "Reserva creada (placeholder)", datos: cuerpo },
    { status: 201 }
  );
}
