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
    <div className="min-h-screen bg-[#2C1810] flex flex-col font-sans">

      {/* Zona superior decorativa */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#C8852A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#FDF6EC] tracking-tight">
              Café Aroma
            </h1>
            <p className="text-[#FDF6EC]/50 text-sm mt-1 font-medium">
              Panel de Administración
            </p>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-[#FDF6EC] rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-[#2C1810] mb-1">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[#7A5C44] mb-6">
              Accede para gestionar reservas y mesas
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#7A5C44] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cafearoma.mx"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-white border border-[#E8D5B7] rounded-xl text-sm font-medium text-[#2C1810] placeholder:text-[#2C1810]/25 outline-none focus:border-[#C8852A] focus:ring-2 focus:ring-[#C8852A]/20 transition-all"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-[#7A5C44] uppercase tracking-wider mb-1.5">
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
                    className="w-full px-4 py-3 pr-11 bg-white border border-[#E8D5B7] rounded-xl text-sm font-medium text-[#2C1810] placeholder:text-[#2C1810]/25 outline-none focus:border-[#C8852A] focus:ring-2 focus:ring-[#C8852A]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C1810]/40 hover:text-[#2C1810]/70 transition-colors"
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
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3.5 bg-[#2C1810] text-[#FDF6EC] font-bold rounded-xl hover:bg-[#3d2410] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {cargando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {cargando ? "Verificando..." : "Entrar al panel"}
              </button>
            </form>
          </div>

          {/* Link a la app pública */}
          <p className="text-center text-[#FDF6EC]/30 text-xs mt-6">
            ¿Eres cliente?{" "}
            <a href="/" className="text-[#C8852A] font-semibold hover:text-[#e09a3a] transition-colors">
              Ver reservas
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
