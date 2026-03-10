import { readFileSync, existsSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "src", "data", "hero-imagenes.json");

export interface ImagenHero {
  id: string;
  nombre: string;
  url: string;
}

export interface ConfigHero {
  imagenes: ImagenHero[];
  intervalo: number;
}

const CONFIG_DEFECTO: ConfigHero = {
  imagenes: [{ id: "default", nombre: "hero-cafeteria.png", url: "/hero-cafeteria.png" }],
  intervalo: 5000,
};

export function obtenerConfigHero(): ConfigHero {
  try {
    if (existsSync(CONFIG_PATH)) {
      const raw = readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(raw) as ConfigHero;
      if (Array.isArray(parsed.imagenes) && parsed.imagenes.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback al default
  }
  return CONFIG_DEFECTO;
}
