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

export interface HorarioDia {
  dia: string;
  apertura: string;
  cierre: string;
  cerrado: boolean;
}

export interface InfoNegocio {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  redesSociales: {
    instagram: string;
    facebook: string;
  };
  horarios: HorarioDia[];
  politicaCancelacion: {
    horasAnticipacion: number;
    descripcion: string;
  };
  reservas: {
    duracionMinutos: number;
    maxPersonasPorReserva: number;
    anticipacionMaximaDias: number;
    horariosDisponibles: string[];
  };
}
