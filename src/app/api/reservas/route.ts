import { NextResponse } from "next/server";
import { esquemaReserva } from "@/lib/validaciones";
import { registrarReservaEnPancake, asegurarTablaCRM } from "@/lib/pancake";

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
  const idReserva = `RES-${Math.floor(10000 + Math.random() * 90000)}`;

  // Asegurar tabla CRM existe y sincronizar con Pancake (sin bloquear si falla)
  void asegurarTablaCRM();
  const pancake = await registrarReservaEnPancake({
    nombre: datos.nombreCliente,
    telefono: datos.telefono,
    email: datos.email,
    fecha: datos.fecha,
    hora: datos.hora,
    personas: datos.numPersonas,
    mesa: datos.mesaId,
    idReserva,
  });

  if (!pancake.ok) {
    console.warn(`[Reserva ${idReserva}] No se pudo sincronizar con Pancake CRM`);
  }

  // TODO: Guardar reserva en base de datos

  return NextResponse.json(
    {
      ok: true,
      idReserva,
      pancake: {
        sincronizado: pancake.ok,
        clienteId: pancake.clienteId,
        // Si el cliente ya tiene chat en Pancake, enviamos el enlace
        conversationLink: pancake.conversationLink ?? null,
      },
    },
    { status: 201 }
  );
}
