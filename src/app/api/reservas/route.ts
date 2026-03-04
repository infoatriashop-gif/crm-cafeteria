import { NextResponse } from "next/server";
import { esquemaReserva } from "@/lib/validaciones";
import { registrarReservaEnPancake } from "@/lib/pancake";

// GET /api/reservas — Obtener reservas
export async function GET() {
  // TODO: Implementar consulta a base de datos
  return NextResponse.json({ reservas: [] });
}

// POST /api/reservas — Crear una reserva
export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido" }, { status: 400 });
  }

  const resultado = esquemaReserva.safeParse(cuerpo);
  if (!resultado.success) {
    return NextResponse.json(
      { error: "Datos inválidos", detalles: resultado.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const datos = resultado.data;

  // Generar ID de reserva único
  const idReserva = `RES-${Math.floor(10000 + Math.random() * 90000)}`;

  // Sincronizar cliente con Pancake CRM (no bloquea si falla)
  const { clienteId, ok: pancakeOk } = await registrarReservaEnPancake({
    nombre: datos.nombreCliente,
    telefono: datos.telefono,
    email: datos.email,
    fecha: datos.fecha,
    hora: datos.hora,
    personas: datos.numPersonas,
    mesa: datos.mesaId,
    idReserva,
  });

  if (!pancakeOk) {
    console.warn(`[Reserva ${idReserva}] No se pudo sincronizar con Pancake CRM`);
  }

  // TODO: Guardar reserva en base de datos

  return NextResponse.json(
    {
      ok: true,
      idReserva,
      pancakeClienteId: clienteId,
      mensaje: "Reserva creada exitosamente",
    },
    { status: 201 }
  );
}
