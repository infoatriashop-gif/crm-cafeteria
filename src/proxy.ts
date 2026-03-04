import { NextRequest, NextResponse } from "next/server";

async function generarToken(email: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const firma = await crypto.subtle.sign("HMAC", key, encoder.encode(email));
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ruta de login: si ya está autenticado, redirigir al admin
  if (pathname === "/admin/login") {
    const sesion = request.cookies.get("admin_session");
    if (sesion?.value) {
      const emailEnv = process.env.ADMIN_EMAIL ?? "";
      const secretEnv = process.env.ADMIN_SECRET ?? "";
      const tokenEsperado = await generarToken(emailEnv, secretEnv);
      if (sesion.value === tokenEsperado) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Todas las demás rutas /admin: verificar autenticación
  const sesion = request.cookies.get("admin_session");
  if (!sesion?.value) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const emailEnv = process.env.ADMIN_EMAIL ?? "";
  const secretEnv = process.env.ADMIN_SECRET ?? "";
  const tokenEsperado = await generarToken(emailEnv, secretEnv);

  if (sesion.value !== tokenEsperado) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("admin_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
