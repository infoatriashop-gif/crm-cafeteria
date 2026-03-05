"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  ArrowLeft,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  Plus,
  Minus,
  CheckCircle2,
  Coffee,
  MapPin,
  Loader2,
  Home,
  CalendarDays,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { esquemaReserva, type DatosReserva } from "@/lib/validaciones";
import { mesas, infoNegocio } from "@/lib/datos-demo";
import type { Mesa } from "@/tipos";

type Paso = 1 | 2 | 3 | "exito";
type FiltroUbicacion = "todas" | "interior" | "terraza";

function formatearFecha(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function obtenerHoy(): string {
  return new Date().toISOString().split("T")[0];
}

function obtenerMaxFecha(): string {
  const d = new Date();
  d.setDate(d.getDate() + infoNegocio.reservas.anticipacionMaximaDias);
  return d.toISOString().split("T")[0];
}

const PASOS_INFO = [
  { num: 1, label: "Datos", icon: User },
  { num: 2, label: "Mesa", icon: MapPin },
  { num: 3, label: "Confirmar", icon: CheckCircle2 },
];

export default function ReservasPage() {
  const [paso, setPaso] = useState<Paso>(1);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [errorMesa, setErrorMesa] = useState(false);
  const [filtroUbicacion, setFiltroUbicacion] = useState<FiltroUbicacion>("todas");
  const [filtroPax, setFiltroPax] = useState<number | null>(null);
  const [whatsapp, setWhatsapp] = useState(true);
  const [numeroReserva, setNumeroReserva] = useState("");
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<DatosReserva>({
    resolver: zodResolver(esquemaReserva),
    defaultValues: {
      nombreCliente: "",
      email: "",
      telefono: "",
      fecha: "",
      hora: "",
      numPersonas: 2,
      mesaId: "",
    },
  });

  const numPersonas = watch("numPersonas") || 2;
  const fecha = watch("fecha");
  const hora = watch("hora");

  const avanzarAPaso2 = async () => {
    const valido = await trigger(["nombreCliente", "email", "telefono", "fecha", "hora", "numPersonas"]);
    if (valido) setPaso(2);
  };

  const avanzarAPaso3 = () => {
    if (!mesaSeleccionada) {
      setErrorMesa(true);
      return;
    }
    setValue("mesaId", mesaSeleccionada.id);
    setPaso(3);
  };

  const onSubmit = async (datos: DatosReserva) => {
    setCargando(true);
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, recibirWhatsapp: whatsapp }),
      });
      if (res.ok || res.status === 201) {
        const sufijo = Math.random().toString(36).slice(2, 7).toUpperCase();
        setNumeroReserva(`RES-${sufijo}`);
        setPaso("exito");
      }
    } finally {
      setCargando(false);
    }
  };

  const mesasFiltradas = mesas.filter((m) => {
    if (filtroUbicacion !== "todas" && m.ubicacion !== filtroUbicacion) return false;
    if (filtroPax && m.capacidad < filtroPax) return false;
    return true;
  });

  const mesasInterior = mesasFiltradas.filter((m) => m.ubicacion === "interior");
  const mesasTerraza = mesasFiltradas.filter((m) => m.ubicacion === "terraza");

  // ── PANTALLA ÉXITO ────────────────────────────────────────────
  if (paso === "exito") {
    return (
      <div className="min-h-screen bg-[#0F0B08] font-sans flex items-center justify-center px-5">
        <div className="w-full max-w-md text-center">

          {/* Celebración visual */}
          <div className="relative w-36 h-36 mx-auto mb-8">
            {/* Anillos */}
            <div className="absolute inset-0 rounded-full border-2 border-green-500/10 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-green-500/15" />
            <div className="absolute inset-4 rounded-full bg-green-500/8 border border-green-500/20" />
            {/* Centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center border border-green-500/25">
                <CheckCircle2 className="w-11 h-11 text-green-400" strokeWidth={1.75} />
              </div>
            </div>
            {/* Sparkles decorativos */}
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#C8852A]/70" />
            <Sparkles className="absolute -bottom-1 -left-2 w-4 h-4 text-[#C8852A]/50" />
          </div>

          <h1 className="text-3xl font-extrabold text-[#F0E6D3] mb-2">
            ¡Reserva confirmada!
          </h1>
          <p className="text-[#8A6650] mb-6 leading-relaxed">
            Te enviamos los detalles a tu email
            {whatsapp ? " y WhatsApp" : ""}.
          </p>

          {/* Número de reserva */}
          <div className="inline-flex items-center gap-2 bg-[#C8852A]/15 text-[#C8852A] font-bold px-6 py-3 rounded-2xl text-xl mb-7 border border-[#C8852A]/25 tracking-wide">
            #{numeroReserva}
          </div>

          {/* Detalles */}
          <div className="bg-[#1A1108] rounded-2xl border border-[#2E1E0E] overflow-hidden mb-6 text-left">
            {[
              { icon: Calendar, value: formatearFecha(fecha) },
              { icon: Clock, value: `${hora} · ${infoNegocio.reservas.duracionMinutos} min` },
              {
                icon: MapPin,
                value: mesaSeleccionada
                  ? `Mesa ${mesaSeleccionada.numero} · ${mesaSeleccionada.ubicacion}`
                  : "Mesa asignada",
              },
              { icon: Users, value: `${numPersonas} persona${numPersonas > 1 ? "s" : ""}` },
            ].map(({ icon: Icon, value }, i, arr) => (
              <div key={i}>
                <div className="px-4 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#C8852A]/12 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#C8852A]/15">
                    <Icon className="w-3.5 h-3.5 text-[#C8852A]" />
                  </div>
                  <span className="text-sm text-[#F0E6D3] font-medium capitalize">{value}</span>
                </div>
                {i < arr.length - 1 && <div className="h-px bg-[#2E1E0E] mx-4" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/reservas"
              className="w-full py-4 bg-[#C8852A] text-white font-bold rounded-2xl hover:bg-[#b5741f] transition-all shadow-[0_8px_24px_rgba(200,133,42,0.4)] text-center active:scale-[0.98]"
            >
              Nueva reserva
            </Link>
            <Link
              href="/"
              className="w-full py-4 border border-white/10 text-[#F0E6D3]/60 font-semibold rounded-2xl hover:bg-white/4 transition-colors text-center"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── LAYOUT PRINCIPAL ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0F0B08] font-sans">

      {/* ── HEADER + STEPPER ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0F0B08]/95 backdrop-blur-md border-b border-white/6">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center gap-4">
          {/* Botón atrás */}
          <button
            onClick={() =>
              paso === 1
                ? (window.location.href = "/")
                : setPaso((paso as number) - 1 as Paso)
            }
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A1108] border border-[#2E1E0E] text-[#F0E6D3] flex-shrink-0 hover:bg-[#221610] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Stepper central */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {PASOS_INFO.map(({ num, label, icon: Icon }, i) => {
              const pasoNum = paso as number;
              const activo = pasoNum === num;
              const completado = pasoNum > num;
              return (
                <div key={num} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        activo
                          ? "border-[#C8852A] bg-[#C8852A] text-white shadow-[0_0_12px_rgba(200,133,42,0.4)]"
                          : completado
                          ? "border-[#C8852A] bg-[#C8852A]/15 text-[#C8852A]"
                          : "border-[#2E1E0E] bg-transparent text-[#8A6650]"
                      }`}
                    >
                      {completado ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${
                        activo ? "text-[#C8852A]" : completado ? "text-[#C8852A]/60" : "text-[#8A6650]/50"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < PASOS_INFO.length - 1 && (
                    <div
                      className={`w-8 h-px mb-5 rounded-full transition-colors ${
                        pasoNum > num ? "bg-[#C8852A]/50" : "bg-[#2E1E0E]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Cerrar */}
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A1108] border border-[#2E1E0E] text-[#F0E6D3]/40 flex-shrink-0 hover:text-[#F0E6D3] transition-colors"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── PASO 1: DATOS ─────────────────────────────────── */}
      {paso === 1 && (
        <main className="max-w-2xl mx-auto px-5 py-6 pb-32 md:pb-10 space-y-5">

          {/* Info personal */}
          <div>
            <p className="text-xs font-bold text-[#8A6650] uppercase tracking-widest mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#C8852A]" /> Tu información
            </p>
            <div className="bg-[#1A1108] rounded-2xl border border-[#2E1E0E] overflow-hidden divide-y divide-[#2E1E0E]">

              {/* Nombre */}
              <label className="flex items-center gap-3 px-4 py-4 group focus-within:bg-[#1F140A] transition-colors cursor-text">
                <User className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[#8A6650] uppercase tracking-widest mb-1">
                    Nombre completo
                  </div>
                  <input
                    {...register("nombreCliente")}
                    placeholder="Juan Pérez"
                    className="w-full text-sm font-medium text-[#F0E6D3] bg-transparent outline-none placeholder:text-[#F0E6D3]/20"
                  />
                  {errors.nombreCliente && (
                    <p className="text-red-400 text-xs mt-1">{errors.nombreCliente.message}</p>
                  )}
                </div>
              </label>

              {/* Email */}
              <label className="flex items-center gap-3 px-4 py-4 group focus-within:bg-[#1F140A] transition-colors cursor-text">
                <Mail className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[#8A6650] uppercase tracking-widest mb-1">
                    Email
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="juan@email.com"
                    className="w-full text-sm font-medium text-[#F0E6D3] bg-transparent outline-none placeholder:text-[#F0E6D3]/20"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </label>

              {/* Teléfono */}
              <label className="flex items-center gap-3 px-4 py-4 group focus-within:bg-[#1F140A] transition-colors cursor-text">
                <Phone className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[#8A6650] uppercase tracking-widest mb-1">
                    Teléfono (WhatsApp)
                  </div>
                  <input
                    {...register("telefono")}
                    type="tel"
                    placeholder="+57 300 123 4567"
                    className="w-full text-sm font-medium text-[#F0E6D3] bg-transparent outline-none placeholder:text-[#F0E6D3]/20"
                  />
                  {errors.telefono && (
                    <p className="text-red-400 text-xs mt-1">{errors.telefono.message}</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Detalles de visita */}
          <div>
            <p className="text-xs font-bold text-[#8A6650] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8852A]" /> Detalles de la visita
            </p>
            <div className="bg-[#1A1108] rounded-2xl border border-[#2E1E0E] overflow-hidden divide-y divide-[#2E1E0E]">

              {/* Fecha */}
              <label className="flex items-center gap-3 px-4 py-4 group focus-within:bg-[#1F140A] transition-colors cursor-text">
                <Calendar className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[#8A6650] uppercase tracking-widest mb-1">
                    Fecha
                  </div>
                  <input
                    {...register("fecha")}
                    type="date"
                    min={obtenerHoy()}
                    max={obtenerMaxFecha()}
                    className="w-full text-sm font-medium text-[#F0E6D3] bg-transparent outline-none [color-scheme:dark]"
                  />
                  {errors.fecha && (
                    <p className="text-red-400 text-xs mt-1">{errors.fecha.message}</p>
                  )}
                </div>
              </label>

              {/* Hora */}
              <label className="flex items-center gap-3 px-4 py-4 group focus-within:bg-[#1F140A] transition-colors cursor-text">
                <Clock className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[#8A6650] uppercase tracking-widest mb-1">
                    Hora
                  </div>
                  <select
                    {...register("hora")}
                    className="w-full text-sm font-medium text-[#F0E6D3] bg-transparent outline-none appearance-none [color-scheme:dark]"
                  >
                    <option value="" className="bg-[#1A1108]">Selecciona un horario</option>
                    {infoNegocio.reservas.horariosDisponibles.map((h) => (
                      <option key={h} value={h} className="bg-[#1A1108]">{h}</option>
                    ))}
                  </select>
                  {errors.hora && (
                    <p className="text-red-400 text-xs mt-1">{errors.hora.message}</p>
                  )}
                </div>
              </label>

              {/* Personas */}
              <div className="flex items-center gap-3 px-4 py-4">
                <Users className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-[#8A6650] uppercase tracking-widest mb-2">
                    Número de personas
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setValue("numPersonas", Math.max(numPersonas - 1, 1))}
                      className="w-9 h-9 bg-[#221610] rounded-xl flex items-center justify-center hover:bg-[#2C1C12] active:scale-95 transition-all border border-[#2E1E0E]"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#F0E6D3]" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-[#F0E6D3] leading-none">{numPersonas}</span>
                      <span className="text-[10px] text-[#8A6650] font-medium mt-0.5">
                        {numPersonas === 1 ? "persona" : "personas"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "numPersonas",
                          Math.min(numPersonas + 1, infoNegocio.reservas.maxPersonasPorReserva)
                        )
                      }
                      className="w-9 h-9 bg-[#C8852A] rounded-xl flex items-center justify-center hover:bg-[#b5741f] active:scale-95 transition-all shadow-[0_4px_12px_rgba(200,133,42,0.35)]"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota de duración */}
          <div className="flex items-center gap-3 bg-[#C8852A]/8 border border-[#C8852A]/15 rounded-xl px-4 py-3">
            <Clock className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
            <p className="text-sm text-[#8A6650]">
              <span className="font-semibold text-[#F0E6D3]">Duración:</span>{" "}
              {infoNegocio.reservas.duracionMinutos} min por reserva
            </p>
          </div>

          {/* CTA fijo */}
          <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#0F0B08]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0">
            <button
              type="button"
              onClick={avanzarAPaso2}
              className="group w-full py-4 bg-[#C8852A] text-white font-bold text-base rounded-2xl shadow-[0_8px_32px_rgba(200,133,42,0.4)] hover:bg-[#b5741f] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Siguiente · Elegir mesa
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </main>
      )}

      {/* ── PASO 2: ELEGIR MESA ────────────────────────────── */}
      {paso === 2 && (
        <main className="max-w-2xl mx-auto px-5 py-6 pb-32 md:pb-10 space-y-4">

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
            {[
              { valor: "todas" as FiltroUbicacion, etiqueta: "Todas" },
              { valor: "interior" as FiltroUbicacion, etiqueta: "Interior" },
              { valor: "terraza" as FiltroUbicacion, etiqueta: "Terraza" },
            ].map(({ valor, etiqueta }) => (
              <button
                key={valor}
                type="button"
                onClick={() => setFiltroUbicacion(valor)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filtroUbicacion === valor
                    ? "bg-[#F0E6D3] text-[#0F0B08] shadow-sm"
                    : "bg-[#1A1108] text-[#F0E6D3]/55 border border-[#2E1E0E] hover:border-[#C8852A]/30"
                }`}
              >
                {etiqueta}
              </button>
            ))}
            {[2, 4, 6].map((pax) => (
              <button
                key={pax}
                type="button"
                onClick={() => setFiltroPax(filtroPax === pax ? null : pax)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filtroPax === pax
                    ? "bg-[#C8852A] text-white shadow-[0_4px_12px_rgba(200,133,42,0.35)]"
                    : "bg-[#1A1108] text-[#F0E6D3]/55 border border-[#2E1E0E] hover:border-[#C8852A]/30"
                }`}
              >
                {pax}+ pax
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#8A6650]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8A6650]/50" /> Ocupada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C8852A]" /> Tu selección
            </span>
          </div>

          {/* Mapa de mesas */}
          <div className="bg-[#1A1108] rounded-2xl border border-[#2E1E0E] overflow-hidden">

            {(filtroUbicacion === "todas" || filtroUbicacion === "interior") && mesasInterior.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-[#C8852A] rounded-full" />
                  <p className="text-xs font-bold text-[#8A6650] uppercase tracking-widest">
                    Interior · {mesasInterior.length} mesas
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mesasInterior.map((mesa) => (
                    <TarjetaMesa
                      key={mesa.id}
                      mesa={mesa}
                      seleccionada={mesaSeleccionada?.id === mesa.id}
                      onSeleccionar={() => {
                        setMesaSeleccionada(mesa);
                        setErrorMesa(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {filtroUbicacion === "todas" && mesasTerraza.length > 0 && (
              <div className="h-px bg-[#2E1E0E] mx-4" />
            )}

            {(filtroUbicacion === "todas" || filtroUbicacion === "terraza") && mesasTerraza.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-[#C8852A] rounded-full" />
                  <p className="text-xs font-bold text-[#8A6650] uppercase tracking-widest">
                    Terraza · {mesasTerraza.length} mesas
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mesasTerraza.map((mesa) => (
                    <TarjetaMesa
                      key={mesa.id}
                      mesa={mesa}
                      seleccionada={mesaSeleccionada?.id === mesa.id}
                      onSeleccionar={() => {
                        setMesaSeleccionada(mesa);
                        setErrorMesa(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {errorMesa && (
            <div className="bg-red-900/15 border border-red-800/30 rounded-xl px-4 py-3 text-center">
              <p className="text-red-400 text-sm font-medium">
                Selecciona una mesa para continuar
              </p>
            </div>
          )}

          {mesaSeleccionada && (
            <div className="flex items-center gap-3 bg-[#C8852A]/12 border border-[#C8852A]/25 rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 bg-[#C8852A]/20 rounded-xl flex items-center justify-center border border-[#C8852A]/25 flex-shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#C8852A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F0E6D3]">
                  Mesa {mesaSeleccionada.numero} seleccionada
                </p>
                <p className="text-xs text-[#8A6650] capitalize mt-0.5">
                  {mesaSeleccionada.ubicacion} · Hasta {mesaSeleccionada.capacidad} persona{mesaSeleccionada.capacidad > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#0F0B08]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0">
            <button
              type="button"
              onClick={avanzarAPaso3}
              className="group w-full py-4 bg-[#C8852A] text-white font-bold text-base rounded-2xl shadow-[0_8px_32px_rgba(200,133,42,0.4)] hover:bg-[#b5741f] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Confirmar selección
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </main>
      )}

      {/* ── PASO 3: CONFIRMAR ─────────────────────────────── */}
      {paso === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <main className="max-w-2xl mx-auto px-5 py-6 pb-32 md:pb-10 space-y-4">

            <div>
              <p className="text-xs font-bold text-[#8A6650] uppercase tracking-widest mb-3">
                Resumen de tu reserva
              </p>
              <div className="bg-[#1A1108] rounded-2xl border border-[#2E1E0E] overflow-hidden divide-y divide-[#2E1E0E]">
                {[
                  {
                    icon: User,
                    titulo: watch("nombreCliente"),
                    sub: `${watch("email")} · ${watch("telefono")}`,
                  },
                  {
                    icon: Calendar,
                    titulo: formatearFecha(fecha),
                    sub: `${hora} · ${infoNegocio.reservas.duracionMinutos} min`,
                  },
                  {
                    icon: MapPin,
                    titulo: mesaSeleccionada
                      ? `Mesa ${mesaSeleccionada.numero} · ${mesaSeleccionada.ubicacion}`
                      : "Mesa seleccionada",
                    sub: `Hasta ${mesaSeleccionada?.capacidad ?? "?"} personas`,
                  },
                  {
                    icon: Users,
                    titulo: `${numPersonas} ${numPersonas === 1 ? "persona" : "personas"}`,
                    sub: "Número de comensales",
                  },
                ].map(({ icon: Icon, titulo, sub }, idx) => (
                  <div key={idx} className="px-4 py-4 flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#C8852A]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#C8852A]/15">
                      <Icon className="w-4 h-4 text-[#C8852A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#F0E6D3] capitalize">{titulo}</p>
                      <p className="text-xs text-[#8A6650] mt-0.5 truncate">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Política de cancelación */}
            <div className="bg-[#1A1108] border border-[#2E1E0E] rounded-xl px-4 py-3.5">
              <p className="text-xs font-bold text-[#F0E6D3] mb-1 flex items-center gap-2">
                <span>📋</span> Política de cancelación
              </p>
              <p className="text-xs text-[#8A6650] leading-relaxed">
                {infoNegocio.politicaCancelacion.descripcion}
              </p>
            </div>

            {/* Toggle WhatsApp */}
            <div className="bg-[#1A1108] rounded-2xl border border-[#2E1E0E] px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                    <span className="text-base">💬</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F0E6D3]">
                      Confirmación por WhatsApp
                    </p>
                    <p className="text-xs text-[#8A6650] mt-0.5">
                      Recibe el resumen en tu teléfono
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsapp(!whatsapp)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    whatsapp ? "bg-green-500" : "bg-white/15"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${
                      whatsapp ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#0F0B08]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0 space-y-2.5">
              <button
                type="submit"
                disabled={cargando}
                className="group w-full py-4 bg-[#1A5C3A] text-white font-bold text-base rounded-2xl shadow-[0_8px_32px_rgba(26,92,58,0.45)] hover:bg-[#1d6b43] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {cargando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {cargando ? "Confirmando..." : "Confirmar reserva"}
              </button>
              <p className="text-center text-xs text-[#8A6650]">
                Al confirmar aceptas nuestras condiciones de uso
              </p>
            </div>
          </main>
        </form>
      )}

      {/* ── BOTTOM NAV MOBILE ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1108]/95 backdrop-blur-md border-t border-[#2E1E0E] pb-safe z-40">
        <div className="flex justify-around py-2.5 max-w-lg mx-auto">
          {[
            { icon: Home, etiqueta: "Inicio", activo: false, href: "/" },
            { icon: CalendarDays, etiqueta: "Reservas", activo: true, href: "/reservas" },
            { icon: Search, etiqueta: "Buscar", activo: false, href: "#" },
            { icon: Coffee, etiqueta: "Menú", activo: false, href: "#" },
          ].map(({ icon: Icon, etiqueta, activo, href }) => (
            <Link key={etiqueta} href={href} className="flex flex-col items-center gap-1 px-3 py-1 relative">
              {activo && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C8852A] rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 ${activo ? "text-[#C8852A]" : "text-[#F0E6D3]/30"}`}
                strokeWidth={activo ? 2.5 : 1.75}
              />
              <span className={`text-[10px] font-semibold ${activo ? "text-[#C8852A]" : "text-[#F0E6D3]/30"}`}>
                {etiqueta}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ── COMPONENTE TARJETA MESA ────────────────────────────────────
function TarjetaMesa({
  mesa,
  seleccionada,
  onSeleccionar,
}: {
  mesa: Mesa;
  seleccionada: boolean;
  onSeleccionar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={mesa.disponible ? onSeleccionar : undefined}
      disabled={!mesa.disponible}
      className={`p-4 rounded-xl border-2 text-left transition-all w-full ${
        seleccionada
          ? "border-[#C8852A] bg-[#C8852A]/12 shadow-[0_0_20px_rgba(200,133,42,0.25)]"
          : mesa.disponible
          ? "border-[#2E1E0E] bg-[#221610] hover:border-[#C8852A]/40 hover:bg-[#271810] active:scale-[0.97]"
          : "border-[#2E1E0E]/50 bg-[#1A1108]/50 opacity-40 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-extrabold text-[#F0E6D3]">Mesa {mesa.numero}</span>
        <span
          className={`w-2 h-2 rounded-full ${
            seleccionada ? "bg-[#C8852A]" : mesa.disponible ? "bg-green-400" : "bg-[#8A6650]/40"
          }`}
        />
      </div>
      <div className="flex items-center gap-1 mb-1.5">
        <Users className="w-3 h-3 text-[#8A6650]" />
        <span className="text-xs text-[#8A6650] font-medium">{mesa.capacidad} pax</span>
      </div>
      <div
        className={`text-xs font-bold ${
          seleccionada
            ? "text-[#C8852A]"
            : mesa.disponible
            ? "text-green-400"
            : "text-[#8A6650]/50"
        }`}
      >
        {seleccionada ? "✓ Elegida" : mesa.disponible ? "Disponible" : "Ocupada"}
      </div>
    </button>
  );
}
