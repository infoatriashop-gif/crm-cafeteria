import { z } from "zod";

// Esquema de validación para crear una reserva
export const esquemaReserva = z.object({
  nombreCliente: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().min(8, "Teléfono inválido"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  hora: z.string().min(1, "La hora es obligatoria"),
  numPersonas: z
    .number()
    .min(1, "Mínimo 1 persona")
    .max(20, "Máximo 20 personas"),
  mesaId: z.string().min(1, "Debes seleccionar una mesa"),
});

export type DatosReserva = z.infer<typeof esquemaReserva>;
