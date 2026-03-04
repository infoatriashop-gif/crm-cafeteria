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

// POST /api/admin/auth — Iniciar sesión
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminEmail || !adminPassword || !adminSecret) {
    return NextResponse.json(
      { error: "Servidor no configurado correctamente" },
      { status: 500 }
    );
  }

  if (
    email.trim() !== adminEmail.trim() ||
    password !== adminPassword
  ) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos" },
      { status: 401 }
    );
  }

  const token = await generarToken(adminEmail, adminSecret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: "/",
  });

  return response;
}

// DELETE /api/admin/auth — Cerrar sesión
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_session");
  return response;
}
