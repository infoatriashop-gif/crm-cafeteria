import { Mesa, InfoNegocio } from "@/tipos";

// Información general de la cafetería
export const infoNegocio: InfoNegocio = {
  nombre: "Café Aroma",
  descripcion:
    "Cafetería artesanal con ambiente acogedor. Disfruta de nuestro café de especialidad, repostería casera y platillos ligeros en un espacio pensado para ti.",
  direccion: "Av. Principal #123, Col. Centro, Ciudad de México",
  telefono: "+52 55 1234 5678",
  email: "hola@cafearoma.mx",
  redesSociales: {
    instagram: "@cafearoma.mx",
    facebook: "cafearomamx",
  },
  horarios: [
    { dia: "Lunes", apertura: "07:00", cierre: "21:00", cerrado: false },
    { dia: "Martes", apertura: "07:00", cierre: "21:00", cerrado: false },
    { dia: "Miércoles", apertura: "07:00", cierre: "21:00", cerrado: false },
    { dia: "Jueves", apertura: "07:00", cierre: "22:00", cerrado: false },
    { dia: "Viernes", apertura: "07:00", cierre: "22:00", cerrado: false },
    { dia: "Sábado", apertura: "08:00", cierre: "22:00", cerrado: false },
    { dia: "Domingo", apertura: "08:00", cierre: "18:00", cerrado: false },
  ],
  politicaCancelacion: {
    horasAnticipacion: 2,
    descripcion:
      "Las reservas pueden cancelarse sin costo hasta 2 horas antes de la hora reservada. Cancelaciones tardías o no-shows podrían afectar futuras reservas.",
  },
  reservas: {
    duracionMinutos: 90,
    maxPersonasPorReserva: 12,
    anticipacionMaximaDias: 30,
    horariosDisponibles: [
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ],
  },
};

// Mesas disponibles en la cafetería (12 mesas en total)
export const mesas: Mesa[] = [
  // Interior - 8 mesas
  { id: "mesa-1", numero: 1, capacidad: 2, ubicacion: "interior", disponible: true },
  { id: "mesa-2", numero: 2, capacidad: 2, ubicacion: "interior", disponible: true },
  { id: "mesa-3", numero: 3, capacidad: 4, ubicacion: "interior", disponible: true },
  { id: "mesa-4", numero: 4, capacidad: 4, ubicacion: "interior", disponible: true },
  { id: "mesa-5", numero: 5, capacidad: 4, ubicacion: "interior", disponible: true },
  { id: "mesa-6", numero: 6, capacidad: 6, ubicacion: "interior", disponible: true },
  { id: "mesa-7", numero: 7, capacidad: 8, ubicacion: "interior", disponible: true },
  { id: "mesa-8", numero: 8, capacidad: 12, ubicacion: "interior", disponible: true },
  // Terraza - 4 mesas
  { id: "mesa-9", numero: 9, capacidad: 2, ubicacion: "terraza", disponible: true },
  { id: "mesa-10", numero: 10, capacidad: 2, ubicacion: "terraza", disponible: true },
  { id: "mesa-11", numero: 11, capacidad: 4, ubicacion: "terraza", disponible: true },
  { id: "mesa-12", numero: 12, capacidad: 6, ubicacion: "terraza", disponible: true },
];

// Reservas de ejemplo
export const reservasDemo: {
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
}[] = [
  {
    id: "res-001",
    mesaId: "mesa-3",
    nombreCliente: "María López",
    email: "maria.lopez@email.com",
    telefono: "+52 55 9876 5432",
    fecha: "2026-03-04",
    hora: "13:00",
    numPersonas: 3,
    estado: "confirmada",
    creadaEn: "2026-03-02T10:30:00Z",
  },
  {
    id: "res-002",
    mesaId: "mesa-7",
    nombreCliente: "Carlos García",
    email: "carlos.g@email.com",
    telefono: "+52 55 1111 2222",
    fecha: "2026-03-04",
    hora: "19:00",
    numPersonas: 7,
    estado: "confirmada",
    creadaEn: "2026-03-01T15:00:00Z",
  },
  {
    id: "res-003",
    mesaId: "mesa-11",
    nombreCliente: "Ana Martínez",
    email: "ana.mtz@email.com",
    telefono: "+52 55 3333 4444",
    fecha: "2026-03-05",
    hora: "10:00",
    numPersonas: 4,
    estado: "pendiente",
    creadaEn: "2026-03-03T08:15:00Z",
  },
  {
    id: "res-004",
    mesaId: "mesa-1",
    nombreCliente: "Roberto Sánchez",
    email: "roberto.s@email.com",
    telefono: "+52 55 5555 6666",
    fecha: "2026-03-03",
    hora: "08:30",
    numPersonas: 2,
    estado: "cancelada",
    creadaEn: "2026-02-28T20:00:00Z",
  },
  {
    id: "res-005",
    mesaId: "mesa-8",
    nombreCliente: "Laura Fernández",
    email: "laura.f@email.com",
    telefono: "+52 55 7777 8888",
    fecha: "2026-03-06",
    hora: "14:00",
    numPersonas: 10,
    estado: "confirmada",
    creadaEn: "2026-03-02T12:45:00Z",
  },
];

// Helpers
export const capacidadTotal = mesas.reduce((sum, m) => sum + m.capacidad, 0);
export const totalMesasInterior = mesas.filter((m) => m.ubicacion === "interior").length;
export const totalMesasTerraza = mesas.filter((m) => m.ubicacion === "terraza").length;
