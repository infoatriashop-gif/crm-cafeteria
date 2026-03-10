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
  Coffee,
  MapPin,
  Loader2,
  Home,
  CalendarDays,
  Search,
  ArrowRight,
  Check,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { esquemaReserva, type DatosReserva } from "@/lib/validaciones";
import { mesas, infoNegocio } from "@/lib/datos-demo";
import { MesaSVG } from "@/components/mesa-svg";
import type { Mesa } from "@/tipos";

type Paso = 1 | 2 | 3 | "exito";
type FiltroUbicacion = "todas" | "interior" | "terraza";

function formatearFecha(dateStr: string): string {
  if (!dateStr) return "";
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
  { num: 3, label: "Confirmar", icon: Check },
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

  // ── PANTALLA EXITO ────────────────────────────────────────────
  if (paso === "exito") {
    return (
      <div className="min-h-screen bg-[#F9F5EF] font-[family-name:var(--font-manrope)] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center animate-scale-in">

          {/* Celebracion visual */}
          <div className="relative w-[120px] h-[120px] mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-[#22C55E]/15 bg-[#22C55E]/5 animate-pulse" />
            <div className="absolute inset-5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/15" />
            <div className="absolute inset-[30px] rounded-full bg-[#22C55E]/15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-[#22C55E]" strokeWidth={2} />
            </div>
            {/* Confetti particles */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-[#8E6AA3] rounded-full animate-float" />
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-float delay-200" />
            <div className="absolute -bottom-1 -left-3 w-1.5 h-1.5 bg-[#8E6AA3]/60 rounded-full animate-float delay-400" />
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[28px] text-[#2C1810] mb-2 animate-fade-up delay-100">
            Reserva confirmada!
          </h1>
          <p className="text-[#6B5B7B] text-sm mb-6 leading-relaxed animate-fade-up delay-200">
            Te enviamos los detalles a tu email
            {whatsapp ? " y WhatsApp" : ""}.
          </p>

          {/* Numero de reserva */}
          <div className="inline-flex items-center bg-[#8E6AA3]/10 text-[#8E6AA3] font-semibold px-6 py-3 rounded-2xl text-xl mb-7 border border-[#8E6AA3]/20 tracking-[1px] animate-fade-up delay-300">
            #{numeroReserva}
          </div>

          {/* Detalles */}
          <div className="bg-white rounded-2xl border border-[#D9D0E3]/60 overflow-hidden mb-6 text-left shadow-sm animate-fade-up delay-400">
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
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#8E6AA3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#8E6AA3]" />
                  </div>
                  <span className="text-[13px] text-[#2C1810] font-medium capitalize">{value}</span>
                </div>
                {i < arr.length - 1 && <div className="h-px bg-[#D9D0E3]/60 mx-4" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 animate-fade-up delay-500">
            <Link
              href="/reservas"
              className="w-full py-4 bg-[#8E6AA3] text-white font-semibold rounded-2xl hover:bg-[#7A5691] transition-all text-center active:scale-[0.98] text-[15px] shadow-md shadow-[#8E6AA3]/15 hover:shadow-lg"
            >
              Nueva reserva
            </Link>
            <Link
              href="/"
              className="w-full py-4 border border-[#D9D0E3] text-[#6B5B7B] font-medium rounded-2xl hover:bg-[#F0EBE3] transition-colors text-center text-[15px]"
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
    <div className="min-h-screen bg-[#F9F5EF] font-[family-name:var(--font-manrope)]">

      {/* ── HEADER + STEPPER ─────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-[#D9D0E3]/80 animate-fade-down">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() =>
              paso === 1
                ? (window.location.href = "/")
                : setPaso((paso as number) - 1 as Paso)
            }
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0EBE3] text-[#2C1810] flex-shrink-0 hover:bg-[#EBE3D8] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Stepper */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {PASOS_INFO.map(({ num, label, icon: Icon }, i) => {
              const pasoNum = paso as number;
              const activo = pasoNum === num;
              const completado = pasoNum > num;
              return (
                <div key={num} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        activo
                          ? "border-[#8E6AA3] bg-[#8E6AA3] text-white shadow-md shadow-[#8E6AA3]/20 scale-110"
                          : completado
                          ? "border-[#8E6AA3] bg-[#8E6AA3]/10 text-[#8E6AA3]"
                          : "border-[#D9D0E3] bg-transparent text-[#9B8FB0]"
                      }`}
                    >
                      {completado ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wider transition-colors ${
                        activo ? "text-[#8E6AA3]" : completado ? "text-[#8E6AA3]/60" : "text-[#9B8FB0]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < PASOS_INFO.length - 1 && (
                    <div
                      className={`w-6 h-px mb-5 rounded-full transition-all duration-500 ${
                        pasoNum > num ? "bg-[#8E6AA3]/50 w-8" : "bg-[#D9D0E3]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0EBE3] text-[#9B8FB0] flex-shrink-0 hover:text-[#2C1810] hover:bg-[#EBE3D8] transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-[#D9D0E3]/40">
          <div
            className="h-full bg-gradient-to-r from-[#8E6AA3] to-[#7A5691] transition-all duration-700 ease-out rounded-full"
            style={{ width: `${((paso as number) / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* ── PASO 1: DATOS ─────────────────────────────────── */}
      {paso === 1 && (
        <main className="max-w-2xl mx-auto px-5 py-5 pb-32 md:pb-10 space-y-5 animate-fade-up">

          <div>
            <p className="text-[10px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#8E6AA3]" /> Tu informacion
            </p>
            <div className="bg-white rounded-2xl border border-[#D9D0E3]/60 overflow-hidden divide-y divide-[#D9D0E3]/60 shadow-sm">

              {/* Nombre */}
              <label className="flex items-center gap-3 px-4 py-3.5 group focus-within:bg-[#F9F5EF] transition-colors cursor-text">
                <User className="w-4 h-4 text-[#8E6AA3] flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-[9px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-1 group-focus-within:text-[#8E6AA3] transition-colors">
                    Nombre completo
                  </div>
                  <input
                    {...register("nombreCliente")}
                    placeholder="Juan Perez"
                    className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none placeholder:text-[#C4BAD4]"
                  />
                  {errors.nombreCliente && (
                    <p className="text-[#EF4444] text-xs mt-1 animate-fade-in">{errors.nombreCliente.message}</p>
                  )}
                </div>
              </label>

              {/* Email */}
              <label className="flex items-center gap-3 px-4 py-3.5 group focus-within:bg-[#F9F5EF] transition-colors cursor-text">
                <Mail className="w-4 h-4 text-[#8E6AA3] flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-[9px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-1 group-focus-within:text-[#8E6AA3] transition-colors">
                    Email
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="juan@email.com"
                    className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none placeholder:text-[#C4BAD4]"
                  />
                  {errors.email && (
                    <p className="text-[#EF4444] text-xs mt-1 animate-fade-in">{errors.email.message}</p>
                  )}
                </div>
              </label>

              {/* Telefono */}
              <label className="flex items-center gap-3 px-4 py-3.5 group focus-within:bg-[#F9F5EF] transition-colors cursor-text">
                <Phone className="w-4 h-4 text-[#8E6AA3] flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-[9px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-1 group-focus-within:text-[#8E6AA3] transition-colors">
                    Telefono (WhatsApp)
                  </div>
                  <input
                    {...register("telefono")}
                    type="tel"
                    placeholder="+57 300 123 4567"
                    className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none placeholder:text-[#C4BAD4]"
                  />
                  {errors.telefono && (
                    <p className="text-[#EF4444] text-xs mt-1 animate-fade-in">{errors.telefono.message}</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Detalles de visita */}
          <div>
            <p className="text-[10px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8E6AA3]" /> Detalles de la visita
            </p>
            <div className="bg-white rounded-2xl border border-[#D9D0E3]/60 overflow-hidden divide-y divide-[#D9D0E3]/60 shadow-sm">

              {/* Fecha */}
              <label className="flex items-center gap-3 px-4 py-3.5 group focus-within:bg-[#F9F5EF] transition-colors cursor-text">
                <Calendar className="w-4 h-4 text-[#8E6AA3] flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-[9px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-1 group-focus-within:text-[#8E6AA3] transition-colors">
                    Fecha
                  </div>
                  <input
                    {...register("fecha")}
                    type="date"
                    min={obtenerHoy()}
                    max={obtenerMaxFecha()}
                    className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none"
                  />
                  {errors.fecha && (
                    <p className="text-[#EF4444] text-xs mt-1 animate-fade-in">{errors.fecha.message}</p>
                  )}
                </div>
              </label>

              {/* Hora */}
              <label className="flex items-center gap-3 px-4 py-3.5 group focus-within:bg-[#F9F5EF] transition-colors cursor-text">
                <Clock className="w-4 h-4 text-[#8E6AA3] flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-[9px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-1 group-focus-within:text-[#8E6AA3] transition-colors">
                    Hora
                  </div>
                  <select
                    {...register("hora")}
                    className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona un horario</option>
                    {infoNegocio.reservas.horariosDisponibles.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  {errors.hora && (
                    <p className="text-[#EF4444] text-xs mt-1 animate-fade-in">{errors.hora.message}</p>
                  )}
                </div>
              </label>

              {/* Personas */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Users className="w-4 h-4 text-[#8E6AA3] flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[9px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-2">
                    Personas
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setValue("numPersonas", Math.max(numPersonas - 1, 1))}
                      className="w-8 h-8 bg-[#F0EBE3] rounded-xl flex items-center justify-center hover:bg-[#EBE3D8] active:scale-90 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#2C1810]" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#2C1810] leading-none tabular-nums">{numPersonas}</span>
                      <span className="text-[10px] text-[#9B8FB0] font-medium mt-0.5">
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
                      className="w-8 h-8 bg-[#8E6AA3] rounded-xl flex items-center justify-center hover:bg-[#7A5691] active:scale-90 transition-all shadow-sm shadow-[#8E6AA3]/20"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nota duracion */}
          <div className="flex items-center gap-3 bg-[#8E6AA3]/8 border border-[#8E6AA3]/15 rounded-xl px-3.5 py-3">
            <Clock className="w-3.5 h-3.5 text-[#8E6AA3] flex-shrink-0" />
            <p className="text-[13px] text-[#6B5B7B]">
              <span className="font-semibold text-[#2C1810]">Duracion:</span>{" "}
              {infoNegocio.reservas.duracionMinutos} min por reserva
            </p>
          </div>

          {/* CTA */}
          <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#F9F5EF]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0">
            <button
              type="button"
              onClick={avanzarAPaso2}
              className="group w-full py-4 bg-[#8E6AA3] text-white font-semibold text-[15px] rounded-2xl hover:bg-[#7A5691] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#8E6AA3]/15 hover:shadow-xl"
            >
              Siguiente · Elegir mesa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </main>
      )}

      {/* ── PASO 2: ELEGIR MESA (SVG FLOOR PLAN) ──────────── */}
      {paso === 2 && (
        <main className="max-w-2xl mx-auto px-5 py-5 pb-32 md:pb-10 space-y-4 animate-slide-right">

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
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                  filtroUbicacion === valor
                    ? "bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/15"
                    : "bg-white text-[#6B5B7B] border border-[#D9D0E3] hover:border-[#8E6AA3]/30 hover:shadow-sm"
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
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                  filtroPax === pax
                    ? "bg-[#8E6AA3] text-white shadow-md shadow-[#8E6AA3]/15"
                    : "bg-white text-[#6B5B7B] border border-[#D9D0E3] hover:border-[#8E6AA3]/30 hover:shadow-sm"
                }`}
              >
                {pax}+ pax
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#6B5B7B]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C4BAD4]" /> Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9D0E3]" /> Ocupada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8E6AA3] animate-pulse-gold" /> Tu seleccion
            </span>
          </div>

          {/* Plano de mesas */}
          {(filtroUbicacion === "todas" || filtroUbicacion === "interior") && mesasInterior.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#D9D0E3]/60 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-[#2C1810] rounded-full" />
                <p className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                  Interior · {mesasInterior.length} mesas
                </p>
              </div>
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-2"
                style={{
                  backgroundImage: "radial-gradient(circle, #D9D0E3 0.5px, transparent 0.5px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {mesasInterior.map((mesa) => (
                  <MesaSVG
                    key={mesa.id}
                    mesa={mesa}
                    seleccionada={mesaSeleccionada?.id === mesa.id}
                    onClick={() => {
                      setMesaSeleccionada(mesa);
                      setErrorMesa(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {(filtroUbicacion === "todas" || filtroUbicacion === "terraza") && mesasTerraza.length > 0 && (
            <div className="bg-gradient-to-b from-[#F0EBE3] to-white rounded-2xl border border-[#D9D0E3]/60 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-[#8E6AA3] rounded-full" />
                <p className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                  Terraza · {mesasTerraza.length} mesas
                </p>
                <span className="text-[10px] text-[#6B5B7B] font-medium ml-auto flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#8E6AA3]" />
                  Al aire libre
                </span>
              </div>
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-2"
                style={{
                  backgroundImage: "radial-gradient(circle, #D9D0E3 0.5px, transparent 0.5px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {mesasTerraza.map((mesa) => (
                  <MesaSVG
                    key={mesa.id}
                    mesa={mesa}
                    seleccionada={mesaSeleccionada?.id === mesa.id}
                    onClick={() => {
                      setMesaSeleccionada(mesa);
                      setErrorMesa(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {errorMesa && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 text-center animate-scale-in">
              <p className="text-[#EF4444] text-sm font-medium">
                Selecciona una mesa para continuar
              </p>
            </div>
          )}

          {mesaSeleccionada && (
            <div className="flex items-center gap-3 bg-[#8E6AA3]/8 border border-[#8E6AA3]/15 rounded-2xl px-4 py-3.5 animate-scale-in">
              <div className="w-9 h-9 bg-[#8E6AA3]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#8E6AA3]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2C1810]">
                  Mesa {mesaSeleccionada.numero} seleccionada
                </p>
                <p className="text-xs text-[#6B5B7B] capitalize mt-0.5">
                  {mesaSeleccionada.ubicacion} · Hasta {mesaSeleccionada.capacidad} persona{mesaSeleccionada.capacidad > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#F9F5EF]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0">
            <button
              type="button"
              onClick={avanzarAPaso3}
              className="group w-full py-4 bg-[#8E6AA3] text-white font-semibold text-[15px] rounded-2xl hover:bg-[#7A5691] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#8E6AA3]/15 hover:shadow-xl"
            >
              Confirmar seleccion
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </main>
      )}

      {/* ── PASO 3: CONFIRMAR ─────────────────────────────── */}
      {paso === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <main className="max-w-2xl mx-auto px-5 py-5 pb-32 md:pb-10 space-y-4 animate-slide-right">

            <div>
              <p className="text-[10px] font-semibold text-[#9B8FB0] uppercase tracking-[1px] mb-3">
                Resumen de tu reserva
              </p>
              <div className="bg-white rounded-2xl border border-[#D9D0E3]/60 overflow-hidden divide-y divide-[#D9D0E3]/60 shadow-sm">
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
                    sub: "Numero de comensales",
                  },
                ].map(({ icon: Icon, titulo, sub }, idx) => (
                  <div key={idx} className="px-4 py-3.5 flex items-start gap-3 hover:bg-[#F9F5EF]/50 transition-colors">
                    <div className="w-9 h-9 bg-[#8E6AA3]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#8E6AA3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2C1810] capitalize">{titulo}</p>
                      <p className="text-xs text-[#6B5B7B] mt-0.5 truncate">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Politica */}
            <div className="bg-white border border-[#D9D0E3]/60 rounded-xl px-4 py-3.5 shadow-sm">
              <p className="text-xs font-semibold text-[#2C1810] mb-1">
                Politica de cancelacion
              </p>
              <p className="text-xs text-[#6B5B7B] leading-relaxed">
                {infoNegocio.politicaCancelacion.descripcion}
              </p>
            </div>

            {/* Toggle WhatsApp */}
            <div className="bg-white rounded-2xl border border-[#D9D0E3]/60 px-4 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#22C55E]/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C1810]">
                      Confirmacion por WhatsApp
                    </p>
                    <p className="text-xs text-[#6B5B7B] mt-0.5">
                      Recibe el resumen en tu telefono
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsapp(!whatsapp)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    whatsapp ? "bg-[#22C55E]" : "bg-[#C4BAD4]"
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

            <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#F9F5EF]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0 space-y-2.5">
              <button
                type="submit"
                disabled={cargando}
                className="group w-full py-4 bg-[#22C55E] text-white font-semibold text-[15px] rounded-2xl hover:bg-[#16A34A] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-[#22C55E]/15 hover:shadow-xl"
              >
                {cargando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                {cargando ? "Confirmando..." : "Confirmar reserva"}
              </button>
              <p className="text-center text-xs text-[#9B8FB0]">
                Al confirmar aceptas nuestras condiciones de uso
              </p>
            </div>
          </main>
        </form>
      )}

      {/* ── BOTTOM NAV MOBILE ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-[#D9D0E3]/80 pb-safe z-40">
        <div className="flex justify-around py-2.5 max-w-lg mx-auto">
          {[
            { icon: Home, etiqueta: "Inicio", activo: false, href: "/" },
            { icon: CalendarDays, etiqueta: "Reservas", activo: true, href: "/reservas" },
            { icon: Search, etiqueta: "Buscar", activo: false, href: "#" },
            { icon: Coffee, etiqueta: "Menu", activo: false, href: "#" },
          ].map(({ icon: Icon, etiqueta, activo, href }) => (
            <Link key={etiqueta} href={href} className="flex flex-col items-center gap-1 px-3 py-1 relative active:scale-90 transition-transform">
              {activo && (
                <span className="absolute -top-2.5 w-5 h-0.5 bg-[#8E6AA3] rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${activo ? "text-[#8E6AA3]" : "text-[#9B8FB0]"}`}
                strokeWidth={activo ? 2.5 : 1.75}
              />
              <span className={`text-[10px] font-semibold transition-colors ${activo ? "text-[#8E6AA3]" : "text-[#9B8FB0]"}`}>
                {etiqueta}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
