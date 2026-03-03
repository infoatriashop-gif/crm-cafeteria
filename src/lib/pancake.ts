// Cliente para la API de Pancake CRM
// Placeholder - se implementará cuando la API esté disponible

const PANCAKE_API_URL = process.env.PANCAKE_API_URL || "";
const PANCAKE_API_KEY = process.env.PANCAKE_API_KEY || "";

export async function enviarClienteAPancake(datos: {
  nombre: string;
  email: string;
  telefono: string;
}) {
  if (!PANCAKE_API_URL || !PANCAKE_API_KEY) {
    console.warn("Pancake CRM no configurado. Omitiendo sincronización.");
    return null;
  }

  // TODO: Implementar llamada real a Pancake CRM
  console.log("Sincronizando con Pancake CRM:", datos);
  return { ok: true };
}
