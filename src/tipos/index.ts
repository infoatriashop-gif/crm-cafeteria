// Tipos principales del sistema de reservas

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  ubicacion: "interior" | "terraza";
  disponible: boolean;
}

export interface Reserva {
  id: string;
  mesaId: string;
  nombreCliente: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  numPersonas: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  creadaEn: string;
}
