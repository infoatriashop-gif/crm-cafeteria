"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

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
        setError(data.error ?? "Error al iniciar sesion");
      }
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col font-[family-name:var(--font-manrope)] relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8E6AA3]/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#8E6AA3]/3 rounded-full blur-[100px]" />

      {/* Zona superior decorativa */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 relative">
        <div className="w-full max-w-sm animate-scale-in">

          {/* Logo */}
          <div className="text-center mb-10">
            <Image src="/logo-simbolo.png" alt="Café Orquídea Real" width={64} height={64} className="rounded-2xl mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-[#FAF8F5] tracking-tight font-[family-name:var(--font-playfair)]">
              Café Orquídea Real
            </h1>
            <p className="text-[#FAF8F5]/50 text-sm mt-1 font-medium">
              Panel de Administracion
            </p>
          </div>

          {/* Tarjeta del formulario */}
          <div className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-3xl p-6 shadow-2xl animate-fade-up delay-200">
            <h2 className="text-lg font-bold text-[#FAF8F5] mb-1 font-[family-name:var(--font-playfair)]">
              Iniciar sesion
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
                  placeholder="admin@cafeorquideareal.co"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] rounded-xl text-sm font-medium text-[#FAF8F5] placeholder:text-[#FAF8F5]/20 outline-none focus:border-[#8E6AA3] focus:ring-2 focus:ring-[#8E6AA3]/20 transition-all"
                />
              </div>

              {/* Contrasena */}
              <div>
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-1.5">
                  Contrasena
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-11 bg-[#141414] border border-[#1F1F1F] rounded-xl text-sm font-medium text-[#FAF8F5] placeholder:text-[#FAF8F5]/20 outline-none focus:border-[#8E6AA3] focus:ring-2 focus:ring-[#8E6AA3]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 hover:text-[#FAF8F5]/70 transition-colors active:scale-90"
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
                <div className="bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 animate-scale-in">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Boton */}
              <button
                type="submit"
                disabled={cargando}
                className="group w-full py-3.5 bg-[#8E6AA3] text-white font-bold rounded-xl hover:bg-[#7A5691] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 shadow-lg shadow-[#8E6AA3]/15 hover:shadow-xl hover:shadow-[#8E6AA3]/25 active:scale-[0.98]"
              >
                {cargando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {cargando ? "Verificando..." : "Entrar al panel"}
                {!cargando && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </form>
          </div>

          {/* Link a la app publica */}
          <p className="text-center text-[#FAF8F5]/30 text-xs mt-6 animate-fade-up delay-400">
            Eres cliente?{" "}
            <a href="/" className="text-[#8E6AA3] font-semibold hover:text-[#7A5691] transition-colors">
              Ver reservas
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
