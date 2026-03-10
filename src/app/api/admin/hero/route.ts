import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import type { ConfigHero } from "@/lib/hero-config";

const CONFIG_PATH = join(process.cwd(), "src", "data", "hero-imagenes.json");
const UPLOADS_DIR = join(process.cwd(), "public", "uploads", "hero");

const CONFIG_DEFECTO: ConfigHero = {
  imagenes: [{ id: "default", nombre: "hero-cafeteria.png", url: "/hero-cafeteria.png" }],
  intervalo: 5000,
};

function leerConfig(): ConfigHero {
  try {
    if (existsSync(CONFIG_PATH)) {
      const parsed = JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as ConfigHero;
      if (Array.isArray(parsed.imagenes) && parsed.imagenes.length > 0) return parsed;
    }
  } catch { /* usa default */ }
  return CONFIG_DEFECTO;
}

function guardarConfig(config: ConfigHero) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

function verificarAdmin(req: NextRequest): boolean {
  return !!req.cookies.get("admin_session")?.value;
}

// GET — listar imágenes y config
export async function GET() {
  return NextResponse.json(leerConfig());
}

// POST — subir nueva imagen
export async function POST(req: NextRequest) {
  if (!verificarAdmin(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Error leyendo el archivo" }, { status: 400 });
  }

  const archivo = formData.get("archivo") as File | null;
  if (!archivo) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }

  if (!archivo.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten archivos de imagen" }, { status: 400 });
  }

  const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
  if (archivo.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen no puede superar 8 MB" }, { status: 400 });
  }

  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const ext = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const id = `hero-${Date.now()}`;
  const nombre = `${id}.${ext}`;
  const rutaArchivo = join(UPLOADS_DIR, nombre);

  const buffer = Buffer.from(await archivo.arrayBuffer());
  writeFileSync(rutaArchivo, buffer);

  const config = leerConfig();
  config.imagenes.push({ id, nombre, url: `/uploads/hero/${nombre}` });
  guardarConfig(config);

  return NextResponse.json({ ok: true, imagen: { id, nombre, url: `/uploads/hero/${nombre}` } });
}

// DELETE — eliminar imagen (?id=xxx)
export async function DELETE(req: NextRequest) {
  if (!verificarAdmin(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const config = leerConfig();

  if (config.imagenes.length <= 1) {
    return NextResponse.json({ error: "Debe quedar al menos una imagen" }, { status: 400 });
  }

  const imagen = config.imagenes.find((img) => img.id === id);
  if (!imagen) return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });

  // Eliminar archivo físico solo si es una imagen subida
  if (imagen.url.startsWith("/uploads/hero/")) {
    const rutaFisica = join(process.cwd(), "public", imagen.url);
    try { unlinkSync(rutaFisica); } catch { /* ignora si no existe */ }
  }

  config.imagenes = config.imagenes.filter((img) => img.id !== id);
  guardarConfig(config);

  return NextResponse.json({ ok: true });
}

// PATCH — reordenar o cambiar intervalo
export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json() as { orden?: string[]; intervalo?: number };
  const config = leerConfig();

  if (Array.isArray(body.orden)) {
    const mapa = new Map(config.imagenes.map((img) => [img.id, img]));
    const reordenadas = body.orden
      .map((id) => mapa.get(id))
      .filter((img): img is NonNullable<typeof img> => img !== undefined);
    if (reordenadas.length === config.imagenes.length) {
      config.imagenes = reordenadas;
    }
  }

  if (typeof body.intervalo === "number") {
    config.intervalo = Math.max(2000, Math.min(30000, body.intervalo));
  }

  guardarConfig(config);
  return NextResponse.json({ ok: true, config });
}
