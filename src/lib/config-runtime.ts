// Configuración runtime del sistema
// Arranca con los valores de las variables de entorno y puede ser
// actualizada por el admin sin necesidad de redeploy.
//
// IMPORTANTE: en Vercel (serverless), el estado en memoria es efímero y
// puede resetearse en cualquier cold start. Para producción, configura las
// variables en Vercel Dashboard. Esta configuración runtime es ideal para
// pruebas y desarrollo.

interface ConfigRuntime {
  pancakeApiKey: string;
  pancakeShopId: string;
}

// Singleton en memoria — se inicializa desde process.env
const _config: ConfigRuntime = {
  pancakeApiKey: process.env.PANCAKE_API_KEY ?? "",
  pancakeShopId: process.env.PANCAKE_SHOP_ID ?? "",
};

export function obtenerConfigRuntime(): Readonly<ConfigRuntime> {
  return { ..._config };
}

export function actualizarConfigRuntime(cambios: Partial<ConfigRuntime>): void {
  if (cambios.pancakeApiKey !== undefined) _config.pancakeApiKey = cambios.pancakeApiKey;
  if (cambios.pancakeShopId !== undefined) _config.pancakeShopId = cambios.pancakeShopId;
}

export function pancakeEstaConfigurado(): boolean {
  return Boolean(_config.pancakeApiKey && _config.pancakeShopId);
}
