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
      <div className="min-h-screen bg-[#FDF6EC] font-sans flex items-center justify-center px-5">
        <div className="w-full max-w-md text-center">
          {/* Checkmark animado */}
          <div className="w-24 h-24 bg-[#1A5C3A]/12 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 bg-[#1A5C3A]/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#1A5C3A]" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-[#2C1810] mb-3">
            ¡Reserva confirmada!
          </h1>
          <p className="text-[#7A5C44] mb-6">
            Te hemos enviado los detalles a tu email
            {whatsapp ? " y WhatsApp" : ""}.
          </p>

          {/* Número de reserva */}
          <div className="inline-flex items-center gap-2 bg-[#C8852A]/15 text-[#C8852A] font-bold px-5 py-2.5 rounded-full text-lg mb-7">
            #{numeroReserva}
          </div>

          {/* Resumen mini */}
          <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-sm p-5 mb-7 text-left space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
              <span className="text-sm text-[#2C1810] font-medium capitalize">
                {formatearFecha(fecha)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
              <span className="text-sm text-[#2C1810] font-medium">
                {hora} · {infoNegocio.reservas.duracionMinutos} min
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
              <span className="text-sm text-[#2C1810] font-medium capitalize">
                {mesaSeleccionada
                  ? `Mesa ${mesaSeleccionada.numero} · ${mesaSeleccionada.ubicacion}`
                  : "Mesa asignada"}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-3">
            <Link
              href="/reservas"
              className="w-full py-4 bg-[#C8852A] text-white font-bold rounded-full hover:bg-[#b5741f] transition-colors text-center"
            >
              Nueva reserva
            </Link>
            <Link
              href="/"
              className="w-full py-4 border-2 border-[#2C1810]/20 text-[#2C1810] font-semibold rounded-full hover:bg-[#2C1810]/5 transition-colors text-center"
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
    <div className="min-h-screen bg-[#FDF6EC] font-sans">

      {/* Header sticky */}
      <header className="sticky top-0 z-50 bg-[#FDF6EC]/95 backdrop-blur-md border-b border-[#2C1810]/10">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* Botón atrás */}
          {paso === 1 ? (
            <Link href="/">
              <ArrowLeft className="w-5 h-5 text-[#2C1810]" />
            </Link>
          ) : (
            <button onClick={() => setPaso((paso as number) - 1 as Paso)}>
              <ArrowLeft className="w-5 h-5 text-[#2C1810]" />
            </button>
          )}

          <h1 className="text-base font-bold text-[#2C1810]">
            {paso === 1 ? "Nueva Reserva" : paso === 2 ? "Elegir Mesa" : "Confirmar Reserva"}
          </h1>

          <Link href="/">
            <X className="w-5 h-5 text-[#2C1810]/50" />
          </Link>
        </div>

        {/* Barra de progreso */}
        <div className="max-w-2xl mx-auto px-5 pb-3">
          <div className="flex gap-1.5 mb-1.5">
            {[1, 2, 3].map((p) => (
              <div
                key={p}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  (paso as number) >= p ? "bg-[#C8852A]" : "bg-[#2C1810]/12"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-semibold">
            <span className={(paso as number) >= 1 ? "text-[#C8852A]" : "text-[#2C1810]/35"}>
              1 · Datos
            </span>
            <span className={(paso as number) >= 2 ? "text-[#C8852A]" : "text-[#2C1810]/35"}>
              2 · Mesa
            </span>
            <span className={(paso as number) >= 3 ? "text-[#C8852A]" : "text-[#2C1810]/35"}>
              3 · Confirmar
            </span>
          </div>
        </div>
      </header>

      {/* ── PASO 1: DATOS ─────────────────────────────────── */}
      {paso === 1 && (
        <main className="max-w-2xl mx-auto px-5 py-6 pb-32 md:pb-10 space-y-5">

          {/* Tu información */}
          <div>
            <p className="text-xs font-bold text-[#7A5C44] uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Tu información
            </p>
            <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">
              {/* Nombre */}
              <div className="px-4 py-3.5">
                <label className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-[#7A5C44] uppercase tracking-wider mb-0.5">
                      Nombre completo
                    </div>
                    <input
                      {...register("nombreCliente")}
                      placeholder="Juan Pérez"
                      className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none placeholder:text-[#2C1810]/25"
                    />
                  </div>
                </label>
                {errors.nombreCliente && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.nombreCliente.message}</p>
                )}
              </div>
              <div className="h-px bg-[#E8D5B7]/60 mx-4" />

              {/* Email */}
              <div className="px-4 py-3.5">
                <label className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-[#7A5C44] uppercase tracking-wider mb-0.5">
                      Email
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="juan@email.com"
                      className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none placeholder:text-[#2C1810]/25"
                    />
                  </div>
                </label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.email.message}</p>
                )}
              </div>
              <div className="h-px bg-[#E8D5B7]/60 mx-4" />

              {/* Teléfono */}
              <div className="px-4 py-3.5">
                <label className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-[#7A5C44] uppercase tracking-wider mb-0.5">
                      Teléfono
                    </div>
                    <input
                      {...register("telefono")}
                      type="tel"
                      placeholder="+52 55 1234 5678"
                      className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none placeholder:text-[#2C1810]/25"
                    />
                  </div>
                </label>
                {errors.telefono && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.telefono.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Detalles de la visita */}
          <div>
            <p className="text-xs font-bold text-[#7A5C44] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Detalles de la visita
            </p>
            <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">
              {/* Fecha */}
              <div className="px-4 py-3.5">
                <label className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-[#7A5C44] uppercase tracking-wider mb-0.5">
                      Fecha
                    </div>
                    <input
                      {...register("fecha")}
                      type="date"
                      min={obtenerHoy()}
                      max={obtenerMaxFecha()}
                      className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none"
                    />
                  </div>
                </label>
                {errors.fecha && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.fecha.message}</p>
                )}
              </div>
              <div className="h-px bg-[#E8D5B7]/60 mx-4" />

              {/* Hora */}
              <div className="px-4 py-3.5">
                <label className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-[#7A5C44] uppercase tracking-wider mb-0.5">
                      Hora
                    </div>
                    <select
                      {...register("hora")}
                      className="w-full text-sm font-medium text-[#2C1810] bg-transparent outline-none appearance-none"
                    >
                      <option value="">Selecciona un horario</option>
                      {infoNegocio.reservas.horariosDisponibles.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </label>
                {errors.hora && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.hora.message}</p>
                )}
              </div>
              <div className="h-px bg-[#E8D5B7]/60 mx-4" />

              {/* Personas */}
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] font-semibold text-[#7A5C44] uppercase tracking-wider mb-0.5">
                      Número de personas
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setValue("numPersonas", Math.max(numPersonas - 1, 1))}
                        className="w-8 h-8 bg-[#F5EAD7] rounded-full flex items-center justify-center hover:bg-[#E8D5B7] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#2C1810]" />
                      </button>
                      <span className="text-xl font-bold text-[#2C1810] w-6 text-center">
                        {numPersonas}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            "numPersonas",
                            Math.min(numPersonas + 1, infoNegocio.reservas.maxPersonasPorReserva)
                          )
                        }
                        className="w-8 h-8 bg-[#C8852A] rounded-full flex items-center justify-center hover:bg-[#b5741f] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </button>
                      <span className="text-xs text-[#7A5C44]">personas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info duración */}
          <div className="flex items-center gap-3 bg-[#C8852A]/10 border border-[#C8852A]/20 rounded-xl px-4 py-3">
            <Clock className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
            <p className="text-sm text-[#7A5C44]">
              <span className="font-semibold text-[#2C1810]">Duración estimada:</span>{" "}
              {infoNegocio.reservas.duracionMinutos} minutos por reserva
            </p>
          </div>

          {/* CTA */}
          <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#FDF6EC]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0">
            <button
              type="button"
              onClick={avanzarAPaso2}
              className="w-full py-4 bg-[#C8852A] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#b5741f] transition-all active:scale-[0.98]"
            >
              Siguiente · Elegir mesa
            </button>
          </div>
        </main>
      )}

      {/* ── PASO 2: ELEGIR MESA ────────────────────────────── */}
      {paso === 2 && (
        <main className="max-w-2xl mx-auto px-5 py-6 pb-32 md:pb-10 space-y-5">

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
                    ? "bg-[#2C1810] text-white shadow-sm"
                    : "bg-white text-[#2C1810]/60 border border-[#E8D5B7]"
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
                    ? "bg-[#C8852A] text-white shadow-sm"
                    : "bg-white text-[#2C1810]/60 border border-[#E8D5B7]"
                }`}
              >
                {pax}+ pax
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#7A5C44]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" /> Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Ocupada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8852A]" /> Tu selección
            </span>
          </div>

          {/* Plano visual */}
          <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">

            {/* Interior */}
            {(filtroUbicacion === "todas" || filtroUbicacion === "interior") && mesasInterior.length > 0 && (
              <div className="p-4">
                <p className="text-[10px] font-bold text-[#7A5C44] uppercase tracking-widest mb-3">
                  Interior
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
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

            {/* Divisor */}
            {filtroUbicacion === "todas" && mesasTerraza.length > 0 && (
              <div className="h-px bg-[#E8D5B7]/60 mx-4" />
            )}

            {/* Terraza */}
            {(filtroUbicacion === "todas" || filtroUbicacion === "terraza") && mesasTerraza.length > 0 && (
              <div className="p-4">
                <p className="text-[10px] font-bold text-[#7A5C44] uppercase tracking-widest mb-3">
                  Terraza
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
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

          {/* Error si no seleccionó */}
          {errorMesa && (
            <p className="text-red-500 text-sm font-medium text-center">
              Por favor selecciona una mesa para continuar
            </p>
          )}

          {/* Resumen selección */}
          {mesaSeleccionada && (
            <div className="flex items-center gap-3 bg-[#C8852A]/12 border border-[#C8852A]/25 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-[#C8852A] flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#2C1810]">
                  Mesa {mesaSeleccionada.numero} seleccionada
                </p>
                <p className="text-xs text-[#7A5C44] capitalize">
                  {mesaSeleccionada.ubicacion} · Hasta {mesaSeleccionada.capacidad} personas
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#FDF6EC]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0">
            <button
              type="button"
              onClick={avanzarAPaso3}
              className="w-full py-4 bg-[#C8852A] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#b5741f] transition-all active:scale-[0.98]"
            >
              Confirmar selección
            </button>
          </div>
        </main>
      )}

      {/* ── PASO 3: CONFIRMAR ─────────────────────────────── */}
      {paso === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <main className="max-w-2xl mx-auto px-5 py-6 pb-32 md:pb-10 space-y-5">

            {/* Resumen */}
            <div>
              <p className="text-xs font-bold text-[#7A5C44] uppercase tracking-wider mb-3">
                Resumen de tu reserva
              </p>
              <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">
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
                ].map(({ icon: Icon, titulo, sub }, idx, arr) => (
                  <div key={idx}>
                    <div className="px-4 py-4 flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#C8852A]/12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-[#C8852A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2C1810] truncate capitalize">{titulo}</p>
                        <p className="text-xs text-[#7A5C44] truncate mt-0.5">{sub}</p>
                      </div>
                    </div>
                    {idx < arr.length - 1 && <div className="h-px bg-[#E8D5B7]/60 mx-4" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Política de cancelación */}
            <div className="bg-[#C8852A]/10 border border-[#C8852A]/20 rounded-xl px-4 py-4">
              <p className="text-sm font-bold text-[#2C1810] mb-1">
                📋 Política de cancelación
              </p>
              <p className="text-xs text-[#7A5C44] leading-relaxed">
                {infoNegocio.politicaCancelacion.descripcion}
              </p>
            </div>

            {/* Toggle WhatsApp */}
            <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2C1810]">
                    Confirmación por WhatsApp
                  </p>
                  <p className="text-xs text-[#7A5C44] mt-0.5">
                    Recibe el resumen en tu teléfono
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsapp(!whatsapp)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    whatsapp ? "bg-[#C8852A]" : "bg-[#2C1810]/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                      whatsapp ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* CTA final */}
            <div className="fixed md:static bottom-20 left-0 right-0 md:bottom-auto px-5 md:px-0 pb-safe md:pb-0 bg-[#FDF6EC]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-3 md:pt-0 space-y-2">
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-4 bg-[#1A5C3A] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#154d30] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {cargando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {cargando ? "Confirmando..." : "Confirmar reserva"}
              </button>
              <p className="text-center text-xs text-[#7A5C44]">
                Al confirmar aceptas nuestras condiciones de uso
              </p>
            </div>
          </main>
        </form>
      )}

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8D5B7]/80 pb-safe z-40">
        <div className="flex justify-around py-2.5 max-w-lg mx-auto">
          {[
            { icon: Home, etiqueta: "Inicio", activo: false, href: "/" },
            { icon: CalendarDays, etiqueta: "Reservas", activo: true, href: "/reservas" },
            { icon: Search, etiqueta: "Buscar", activo: false, href: "#" },
            { icon: Coffee, etiqueta: "Menú", activo: false, href: "#" },
          ].map(({ icon: Icon, etiqueta, activo, href }) => (
            <Link key={etiqueta} href={href} className="flex flex-col items-center gap-1 px-3 py-1">
              <Icon
                className={`w-5 h-5 ${activo ? "text-[#C8852A]" : "text-[#2C1810]/35"}`}
                strokeWidth={activo ? 2.5 : 1.75}
              />
              <span className={`text-[10px] font-semibold ${activo ? "text-[#C8852A]" : "text-[#2C1810]/35"}`}>
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
      className={`p-3 rounded-xl border-2 text-left transition-all w-full ${
        seleccionada
          ? "border-[#C8852A] bg-[#C8852A]/10 shadow-sm"
          : mesa.disponible
          ? "border-[#E8D5B7] bg-[#FDF6EC] hover:border-green-300 hover:bg-green-50/50 active:scale-[0.97]"
          : "border-red-100 bg-red-50/50 opacity-55 cursor-not-allowed"
      }`}
    >
      <div className="text-xs font-bold text-[#2C1810]">Mesa {mesa.numero}</div>
      <div className="flex items-center gap-0.5 mt-0.5">
        <Users className="w-2.5 h-2.5 text-[#7A5C44]" />
        <span className="text-[10px] text-[#7A5C44]">{mesa.capacidad}</span>
      </div>
      <div
        className={`text-[10px] font-bold mt-1.5 ${
          seleccionada
            ? "text-[#C8852A]"
            : mesa.disponible
            ? "text-green-600"
            : "text-red-400"
        }`}
      >
        {seleccionada ? "✓ Elegida" : mesa.disponible ? "Libre" : "Ocupada"}
      </div>
    </button>
  );
}
