"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al iniciar sesión");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col font-[family-name:var(--font-manrope)]">

      {/* Zona superior decorativa */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#C9A962] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#FAF8F5] tracking-tight font-[family-name:var(--font-playfair)]">
              Café Aroma
            </h1>
            <p className="text-[#FAF8F5]/50 text-sm mt-1 font-medium">
              Panel de Administración
            </p>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-[#FAF8F5] mb-1 font-[family-name:var(--font-playfair)]">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[#888888] mb-6">
              Accede para gestionar reservas y mesas
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cafearoma.mx"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] rounded-xl text-sm font-medium text-[#FAF8F5] placeholder:text-[#FAF8F5]/20 outline-none focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-11 bg-[#141414] border border-[#1F1F1F] rounded-xl text-sm font-medium text-[#FAF8F5] placeholder:text-[#FAF8F5]/20 outline-none focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 hover:text-[#FAF8F5]/70 transition-colors"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3.5 bg-[#C9A962] text-white font-bold rounded-xl hover:bg-[#d99535] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {cargando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {cargando ? "Verificando..." : "Entrar al panel"}
              </button>
            </form>
          </div>

          {/* Link a la app pública */}
          <p className="text-center text-[#FAF8F5]/30 text-xs mt-6">
            ¿Eres cliente?{" "}
            <a href="/" className="text-[#C9A962] font-semibold hover:text-[#e09a3a] transition-colors">
              Ver reservas
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
