"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Coffee,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  MapPin,
  ChevronRight,
  UtensilsCrossed,
  Phone,
  Mail,
  RefreshCw,
  Play,
  Zap,
} from "lucide-react";
import { mesas, reservasDemo, infoNegocio } from "@/lib/datos-demo";
import type { Mesa } from "@/tipos";

// ── Tipos locales ──────────────────────────────────────────────
type TabAdmin = "resumen" | "mesas" | "reservas";
type FiltroReservas = "hoy" | "proximas" | "todas";
type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

interface ReservaLocal {
  id: string;
  mesaId: string;
  nombreCliente: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  numPersonas: number;
  estado: EstadoReserva;
  creadaEn: string;
}

// ── Helpers ────────────────────────────────────────────────────
function obtenerHoyStr(): string {
  return new Date().toISOString().split("T")[0];
}

function obtenerMananaStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function formatearFechaEtiqueta(dateStr: string): string {
  const hoy = obtenerHoyStr();
  const manana = obtenerMananaStr();
  if (dateStr === hoy) return "Hoy";
  if (dateStr === manana) return "Mañana";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatearHoraCompleta(dateStr: string): string {
  const hoy = obtenerHoyStr();
  const manana = obtenerMananaStr();
  const d = new Date(dateStr + "T12:00:00");
  const base = d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (dateStr === hoy) return `Hoy — ${base}`;
  if (dateStr === manana) return `Mañana — ${base}`;
  return base;
}

function calcularEstadoMesa(
  mesaId: string,
  reservas: ReservaLocal[]
): "libre" | "ocupada" | "proxima" {
  const hoy = obtenerHoyStr();
  const ahora = new Date();
  const minActual = ahora.getHours() * 60 + ahora.getMinutes();
  const duracion = infoNegocio.reservas.duracionMinutos;

  const reservasHoy = reservas.filter(
    (r) => r.mesaId === mesaId && r.fecha === hoy && r.estado !== "cancelada"
  );

  for (const r of reservasHoy) {
    const [h, m] = r.hora.split(":").map(Number);
    const inicio = h * 60 + m;
    const fin = inicio + duracion;
    if (minActual >= inicio && minActual < fin) return "ocupada";
    if (inicio > minActual && inicio <= minActual + 120) return "proxima";
  }
  return "libre";
}

// ── Componente principal ───────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabAdmin>("resumen");
  const [filtroReservas, setFiltroReservas] = useState<FiltroReservas>("hoy");
  const [reservas, setReservas] = useState<ReservaLocal[]>(reservasDemo);

  const hoy = obtenerHoyStr();

  // Computed stats
  const reservasHoy = reservas.filter((r) => r.fecha === hoy);
  const pendientesTotal = reservas.filter((r) => r.estado === "pendiente").length;
  const mesasOcupadas = mesas.filter(
    (m) => calcularEstadoMesa(m.id, reservas) === "ocupada"
  ).length;
  const mesasLibres = mesas.length - mesasOcupadas;

  const reservasFiltradas = useMemo(() => {
    const base = (() => {
      switch (filtroReservas) {
        case "hoy":
          return reservas.filter((r) => r.fecha === hoy);
        case "proximas":
          return reservas
            .filter((r) => r.fecha > hoy && r.estado !== "cancelada")
            .sort(
              (a, b) =>
                a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
            );
        case "todas":
          return [...reservas].sort(
            (a, b) =>
              a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
          );
      }
    })();
    return base;
  }, [reservas, filtroReservas, hoy]);

  const confirmar = (id: string) =>
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "confirmada" } : r))
    );

  const cancelar = (id: string) =>
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r))
    );

  const cerrarSesion = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // Próximas reservas para la vista resumen
  const proximasReservas = useMemo(
    () =>
      [...reservas]
        .filter((r) => r.estado !== "cancelada" && r.fecha >= hoy)
        .sort(
          (a, b) =>
            a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
        )
        .slice(0, 5),
    [reservas, hoy]
  );

  return (
    <div className="min-h-screen bg-[#FDF6EC] font-sans">

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#2C1810]">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C8852A] rounded-xl flex items-center justify-center shadow-sm">
              <Coffee className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-[#FDF6EC]/45 uppercase tracking-wider">
                Panel de control
              </p>
              <h1 className="text-sm font-extrabold text-[#FDF6EC] leading-tight tracking-tight">
                Café Aroma
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[10px] font-semibold text-[#FDF6EC]/50 hover:text-[#C8852A] transition-colors hidden sm:block"
            >
              Vista cliente
            </Link>
            <button
              onClick={cerrarSesion}
              className="flex items-center gap-1.5 text-[#FDF6EC]/55 hover:text-[#FDF6EC] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:block">Salir</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-5 flex border-t border-[#FDF6EC]/8">
          {(
            [
              { valor: "resumen", etiqueta: "Resumen", icon: LayoutDashboard },
              { valor: "mesas", etiqueta: "Mesas", icon: UtensilsCrossed },
              { valor: "reservas", etiqueta: "Reservas", icon: CalendarDays },
            ] as const
          ).map(({ valor, etiqueta, icon: Icon }) => (
            <button
              key={valor}
              onClick={() => setTab(valor)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold border-b-2 transition-all ${
                tab === valor
                  ? "border-[#C8852A] text-[#C8852A]"
                  : "border-transparent text-[#FDF6EC]/40 hover:text-[#FDF6EC]/65"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {etiqueta}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-12 space-y-5">

        {/* ── TAB: RESUMEN ────────────────────────────────── */}
        {tab === "resumen" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard valor={reservasHoy.length} etiqueta="Reservas hoy" color="text-[#2C1810]" bg="bg-white" />
              <StatCard valor={reservasHoy.filter((r) => r.estado === "confirmada").length} etiqueta="Confirmadas hoy" color="text-[#1A5C3A]" bg="bg-green-50" borde="border-green-100" />
              <StatCard valor={pendientesTotal} etiqueta="Pendientes" color="text-[#C8852A]" bg="bg-[#C8852A]/8" borde="border-[#C8852A]/15" />
              <StatCard valor={mesasLibres} etiqueta="Mesas libres" color="text-[#2C1810]" bg="bg-white" />
            </div>

            {/* Alerta de pendientes */}
            {pendientesTotal > 0 && (
              <div className="bg-[#C8852A]/12 border border-[#C8852A]/25 rounded-2xl px-4 py-3.5 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C8852A] mt-1 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-[#2C1810]">
                    {pendientesTotal} reserva{pendientesTotal > 1 ? "s" : ""} pendiente{pendientesTotal > 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={() => { setTab("reservas"); setFiltroReservas("todas"); }}
                    className="text-xs text-[#C8852A] font-semibold mt-0.5"
                  >
                    Revisar ahora →
                  </button>
                </div>
              </div>
            )}

            {/* Próximas reservas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-[#2C1810]">Próximas reservas</h2>
                <button
                  onClick={() => setTab("reservas")}
                  className="text-xs text-[#C8852A] font-semibold flex items-center gap-0.5"
                >
                  Ver todas <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {proximasReservas.length === 0 ? (
                <div className="text-center py-8 text-[#7A5C44]">
                  <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sin reservas próximas</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {proximasReservas.map((r) => {
                    const mesa = mesas.find((m) => m.id === r.mesaId);
                    return (
                      <TarjetaResumenCompacta
                        key={r.id}
                        reserva={r}
                        mesa={mesa}
                        onConfirmar={confirmar}
                        onCancelar={cancelar}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Demo del sistema — destacado */}
            <Link
              href="/admin/demo"
              className="flex items-center gap-4 bg-gradient-to-r from-[#C8852A] to-[#b5741f] text-white rounded-2xl p-4 shadow-md hover:opacity-90 transition-opacity"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 font-semibold">🎬 Presentación animada</p>
                <p className="text-sm font-extrabold">Ver demo del sistema</p>
                <p className="text-xs text-white/60 mt-0.5">Cómo funciona tu cafetería 24/7</p>
              </div>
              <Zap className="w-5 h-5 text-white/60 flex-shrink-0" />
            </Link>

            {/* Acceso rápido */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTab("mesas")}
                className="bg-[#2C1810] text-[#FDF6EC] rounded-2xl p-4 text-left hover:bg-[#3d2410] transition-colors"
              >
                <UtensilsCrossed className="w-5 h-5 text-[#C8852A] mb-2" />
                <p className="text-xs text-[#FDF6EC]/60">Ver estado de</p>
                <p className="text-sm font-bold">las mesas</p>
              </button>
              <Link
                href="/"
                className="bg-white border border-[#E8D5B7] rounded-2xl p-4 text-left hover:bg-[#F5EAD7] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#C8852A] mb-2" />
                <p className="text-xs text-[#7A5C44]">Ver como</p>
                <p className="text-sm font-bold text-[#2C1810]">cliente</p>
              </Link>
            </div>
          </>
        )}

        {/* ── TAB: MESAS ──────────────────────────────────── */}
        {tab === "mesas" && (
          <>
            {/* Leyenda */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { color: "bg-green-400", texto: "Libre" },
                { color: "bg-red-400", texto: "Ocupada ahora" },
                { color: "bg-[#C8852A]", texto: "Próxima reserva" },
              ].map(({ color, texto }) => (
                <span key={texto} className="flex items-center gap-1.5 text-xs font-semibold text-[#7A5C44]">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  {texto}
                </span>
              ))}
            </div>

            {/* Resumen numérico */}
            <div className="grid grid-cols-3 gap-3">
              {(["libre", "ocupada", "proxima"] as const).map((e) => {
                const count = mesas.filter(
                  (m) => calcularEstadoMesa(m.id, reservas) === e
                ).length;
                const cfg = {
                  libre: { color: "text-green-700", bg: "bg-green-50", borde: "border-green-100", etiq: "Libres" },
                  ocupada: { color: "text-red-600", bg: "bg-red-50", borde: "border-red-100", etiq: "Ocupadas" },
                  proxima: { color: "text-[#C8852A]", bg: "bg-[#C8852A]/8", borde: "border-[#C8852A]/15", etiq: "Próximas" },
                }[e];
                return (
                  <div key={e} className={`${cfg.bg} border ${cfg.borde} rounded-2xl p-4 text-center shadow-sm`}>
                    <div className={`text-3xl font-extrabold ${cfg.color}`}>{count}</div>
                    <div className="text-[10px] text-[#7A5C44] font-semibold mt-0.5">{cfg.etiq}</div>
                  </div>
                );
              })}
            </div>

            {/* Plano visual */}
            <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">
              {/* Interior */}
              <div className="p-4">
                <p className="text-[10px] font-extrabold text-[#7A5C44] uppercase tracking-widest mb-3">
                  Interior — {mesas.filter(m => m.ubicacion === "interior").length} mesas
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {mesas
                    .filter((m) => m.ubicacion === "interior")
                    .map((mesa) => {
                      const estado = calcularEstadoMesa(mesa.id, reservas);
                      const reservaActiva = reservas.find(
                        (r) =>
                          r.mesaId === mesa.id &&
                          r.fecha === hoy &&
                          r.estado !== "cancelada"
                      );
                      return (
                        <TarjetaMesaAdmin
                          key={mesa.id}
                          mesa={mesa}
                          estado={estado}
                          reserva={reservaActiva}
                        />
                      );
                    })}
                </div>
              </div>

              <div className="h-px bg-[#E8D5B7]/60 mx-4" />

              {/* Terraza */}
              <div className="p-4">
                <p className="text-[10px] font-extrabold text-[#7A5C44] uppercase tracking-widest mb-3">
                  Terraza — {mesas.filter(m => m.ubicacion === "terraza").length} mesas
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {mesas
                    .filter((m) => m.ubicacion === "terraza")
                    .map((mesa) => {
                      const estado = calcularEstadoMesa(mesa.id, reservas);
                      const reservaActiva = reservas.find(
                        (r) =>
                          r.mesaId === mesa.id &&
                          r.fecha === hoy &&
                          r.estado !== "cancelada"
                      );
                      return (
                        <TarjetaMesaAdmin
                          key={mesa.id}
                          mesa={mesa}
                          estado={estado}
                          reserva={reservaActiva}
                        />
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Detalle reservas activas hoy */}
            {reservasHoy.filter((r) => r.estado !== "cancelada").length > 0 && (
              <div>
                <h3 className="text-sm font-extrabold text-[#2C1810] mb-3">
                  Ocupación de hoy
                </h3>
                <div className="space-y-2.5">
                  {reservasHoy
                    .filter((r) => r.estado !== "cancelada")
                    .sort((a, b) => a.hora.localeCompare(b.hora))
                    .map((r) => {
                      const mesa = mesas.find((m) => m.id === r.mesaId);
                      return (
                        <TarjetaResumenCompacta
                          key={r.id}
                          reserva={r}
                          mesa={mesa}
                          onConfirmar={confirmar}
                          onCancelar={cancelar}
                        />
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: RESERVAS ───────────────────────────────── */}
        {tab === "reservas" && (
          <>
            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
              {(
                [
                  { valor: "hoy", etiqueta: "Hoy" },
                  { valor: "proximas", etiqueta: "Próximas" },
                  { valor: "todas", etiqueta: "Todas" },
                ] as const
              ).map(({ valor, etiqueta }) => (
                <button
                  key={valor}
                  onClick={() => setFiltroReservas(valor)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    filtroReservas === valor
                      ? "bg-[#2C1810] text-white shadow-sm"
                      : "bg-white text-[#2C1810]/60 border border-[#E8D5B7]"
                  }`}
                >
                  {etiqueta}
                  {valor === "hoy" && reservasHoy.length > 0 && (
                    <span className={`ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      filtroReservas === valor ? "bg-[#C8852A] text-white" : "bg-[#2C1810]/10 text-[#2C1810]"
                    }`}>
                      {reservasHoy.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Lista */}
            {reservasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-[#7A5C44]">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No hay reservas para mostrar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservasFiltradas.map((r) => {
                  const mesa = mesas.find((m) => m.id === r.mesaId);
                  return (
                    <TarjetaReservaCompleta
                      key={r.id}
                      reserva={r}
                      mesa={mesa}
                      onConfirmar={confirmar}
                      onCancelar={cancelar}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── SUB-COMPONENTES ────────────────────────────────────────────

function StatCard({
  valor,
  etiqueta,
  color,
  bg,
  borde = "border-[#E8D5B7]/60",
}: {
  valor: number;
  etiqueta: string;
  color: string;
  bg: string;
  borde?: string;
}) {
  return (
    <div className={`${bg} border ${borde} rounded-2xl p-4 shadow-sm`}>
      <div className={`text-4xl font-extrabold ${color} leading-none`}>{valor}</div>
      <div className="text-xs text-[#7A5C44] font-semibold mt-1.5">{etiqueta}</div>
    </div>
  );
}

function TarjetaMesaAdmin({
  mesa,
  estado,
  reserva,
}: {
  mesa: Mesa;
  estado: "libre" | "ocupada" | "proxima";
  reserva?: ReservaLocal;
}) {
  const cfg = {
    libre: {
      bg: "bg-green-50",
      borde: "border-green-200",
      dot: "bg-green-400",
      texto: "text-green-700",
      etiq: "Libre",
    },
    ocupada: {
      bg: "bg-red-50",
      borde: "border-red-200",
      dot: "bg-red-400",
      texto: "text-red-600",
      etiq: "Ocup.",
    },
    proxima: {
      bg: "bg-[#C8852A]/8",
      borde: "border-[#C8852A]/25",
      dot: "bg-[#C8852A]",
      texto: "text-[#C8852A]",
      etiq: "Próx.",
    },
  }[estado];

  return (
    <div className={`${cfg.bg} border ${cfg.borde} rounded-xl p-2.5 text-center relative`}>
      {estado === "ocupada" && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-[#FDF6EC] animate-pulse" />
      )}
      <div className="text-base font-extrabold text-[#2C1810]">{mesa.numero}</div>
      <div className="flex items-center justify-center gap-0.5 my-0.5">
        <Users className="w-2.5 h-2.5 text-[#7A5C44]" />
        <span className="text-[9px] text-[#7A5C44] font-medium">{mesa.capacidad}</span>
      </div>
      <div className={`text-[9px] font-extrabold ${cfg.texto}`}>{cfg.etiq}</div>
      {reserva && estado !== "libre" && (
        <div className="text-[8px] text-[#7A5C44] mt-0.5 truncate">{reserva.hora}</div>
      )}
    </div>
  );
}

function TarjetaResumenCompacta({
  reserva,
  mesa,
  onConfirmar,
  onCancelar,
}: {
  reserva: ReservaLocal;
  mesa: Mesa | undefined;
  onConfirmar: (id: string) => void;
  onCancelar: (id: string) => void;
}) {
  const estadoDot = {
    confirmada: "bg-green-400",
    pendiente: "bg-[#C8852A] animate-pulse",
    cancelada: "bg-red-400",
  }[reserva.estado];

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7]/80 shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${estadoDot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-[#2C1810] truncate">
            {reserva.nombreCliente}
          </span>
          <span className="text-xs text-[#C8852A] font-bold flex-shrink-0">{reserva.hora}</span>
          <span className="text-xs text-[#7A5C44] flex-shrink-0">
            {formatearFechaEtiqueta(reserva.fecha)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#7A5C44] mt-0.5">
          <span>Mesa {mesa?.numero ?? "?"}</span>
          <span>·</span>
          <span className="capitalize">{mesa?.ubicacion}</span>
          <span>·</span>
          <Users className="w-3 h-3" />
          <span>{reserva.numPersonas}</span>
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        {reserva.estado === "pendiente" && (
          <button
            onClick={() => onConfirmar(reserva.id)}
            className="w-8 h-8 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors"
            title="Confirmar"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </button>
        )}
        {reserva.estado !== "cancelada" && (
          <button
            onClick={() => onCancelar(reserva.id)}
            className="w-8 h-8 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
            title="Cancelar"
          >
            <XCircle className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}

function TarjetaReservaCompleta({
  reserva,
  mesa,
  onConfirmar,
  onCancelar,
}: {
  reserva: ReservaLocal;
  mesa: Mesa | undefined;
  onConfirmar: (id: string) => void;
  onCancelar: (id: string) => void;
}) {
  const estadoCfg = {
    confirmada: {
      label: "Confirmada",
      dot: "bg-green-400",
      color: "text-green-700",
      bg: "bg-green-50",
      borde: "border-green-100",
      cardBorde: "border-green-100",
    },
    pendiente: {
      label: "Pendiente",
      dot: "bg-[#C8852A] animate-pulse",
      color: "text-[#C8852A]",
      bg: "bg-[#C8852A]/8",
      borde: "border-[#C8852A]/20",
      cardBorde: "border-[#C8852A]/20",
    },
    cancelada: {
      label: "Cancelada",
      dot: "bg-red-400",
      color: "text-red-600",
      bg: "bg-red-50",
      borde: "border-red-100",
      cardBorde: "border-red-100",
    },
  }[reserva.estado];

  return (
    <div className={`bg-white rounded-2xl border ${estadoCfg.cardBorde} shadow-sm overflow-hidden`}>
      {/* Cabecera */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-[#2C1810] truncate">
              {reserva.nombreCliente}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-[#7A5C44]">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{reserva.email}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-[#7A5C44]">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{reserva.telefono}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full ${estadoCfg.bg} ${estadoCfg.color} flex-shrink-0 border ${estadoCfg.borde}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${estadoCfg.dot}`} />
            {estadoCfg.label}
          </span>
        </div>

        {/* Grid de detalles */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <DetalleItem icon={CalendarDays} etiqueta="Fecha" valor={formatearHoraCompleta(reserva.fecha)} />
          <DetalleItem icon={Clock} etiqueta="Hora" valor={`${reserva.hora} · ${infoNegocio.reservas.duracionMinutos} min`} />
          <DetalleItem icon={Users} etiqueta="Personas" valor={`${reserva.numPersonas} comensales`} />
          <DetalleItem
            icon={MapPin}
            etiqueta="Mesa"
            valor={mesa ? `Mesa ${mesa.numero} · ${mesa.ubicacion} · ${mesa.capacidad} pax` : "—"}
            capitalize
          />
        </div>
      </div>

      {/* Acciones */}
      {reserva.estado !== "cancelada" && (
        <div className="flex border-t border-[#E8D5B7]/50">
          {reserva.estado === "pendiente" && (
            <button
              onClick={() => onConfirmar(reserva.id)}
              className="flex-1 py-3 flex items-center justify-center gap-1.5 text-green-700 text-xs font-extrabold hover:bg-green-50 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar reserva
            </button>
          )}
          <button
            onClick={() => onCancelar(reserva.id)}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-red-600 text-xs font-extrabold hover:bg-red-50 transition-colors ${
              reserva.estado === "confirmada" ? "border-l border-[#E8D5B7]/50" : ""
            }`}
          >
            <XCircle className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

function DetalleItem({
  icon: Icon,
  etiqueta,
  valor,
  capitalize = false,
}: {
  icon: React.ElementType;
  etiqueta: string;
  valor: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-[#C8852A] flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-[9px] text-[#7A5C44] font-bold uppercase tracking-wider">{etiqueta}</p>
        <p className={`text-xs font-semibold text-[#2C1810] ${capitalize ? "capitalize" : ""}`}>
          {valor}
        </p>
      </div>
    </div>
  );
}
