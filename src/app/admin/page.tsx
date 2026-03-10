"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
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
  Settings,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { mesas, reservasDemo, infoNegocio } from "@/lib/datos-demo";
import type { Mesa } from "@/tipos";

// ── Tipos locales ──────────────────────────────────────────────
type TabAdmin = "resumen" | "mesas" | "reservas" | "config";
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
    <div className="min-h-screen bg-[#0F0F0F] font-[family-name:var(--font-manrope)]">

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-simbolo.png" alt="Café Orquídea Real" width={36} height={36} className="rounded-xl shadow-sm" />
            <div>
              <p className="text-[9px] font-semibold text-[#FAF8F5]/45 uppercase tracking-wider">
                Panel de control
              </p>
              <h1 className="text-sm font-extrabold text-[#FAF8F5] leading-tight tracking-tight font-[family-name:var(--font-playfair)]">
                Café Orquídea Real
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[10px] font-semibold text-[#FAF8F5]/50 hover:text-[#8E6AA3] transition-colors hidden sm:block"
            >
              Vista cliente
            </Link>
            <button
              onClick={cerrarSesion}
              className="flex items-center gap-1.5 text-[#FAF8F5]/55 hover:text-[#FAF8F5] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:block">Salir</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-5 flex border-t border-[#FAF8F5]/8">
          {(
            [
              { valor: "resumen", etiqueta: "Resumen", icon: LayoutDashboard },
              { valor: "mesas", etiqueta: "Mesas", icon: UtensilsCrossed },
              { valor: "reservas", etiqueta: "Reservas", icon: CalendarDays },
              { valor: "config", etiqueta: "Config.", icon: Settings },
            ] as const
          ).map(({ valor, etiqueta, icon: Icon }) => (
            <button
              key={valor}
              onClick={() => setTab(valor)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold border-b-2 transition-all ${
                tab === valor
                  ? "border-[#8E6AA3] text-[#8E6AA3]"
                  : "border-transparent text-[#FAF8F5]/40 hover:text-[#FAF8F5]/65"
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
              <StatCard valor={reservasHoy.length} etiqueta="Reservas hoy" color="text-[#FAF8F5]" bg="bg-[#1A1A1A]" />
              <StatCard valor={reservasHoy.filter((r) => r.estado === "confirmada").length} etiqueta="Confirmadas hoy" color="text-[#4ADE80]" bg="bg-green-900/20" borde="border-green-800/30" />
              <StatCard valor={pendientesTotal} etiqueta="Pendientes" color="text-[#8E6AA3]" bg="bg-[#8E6AA3]/10" borde="border-[#8E6AA3]/15" />
              <StatCard valor={mesasLibres} etiqueta="Mesas libres" color="text-[#FAF8F5]" bg="bg-[#1A1A1A]" />
            </div>

            {/* Alerta de pendientes */}
            {pendientesTotal > 0 && (
              <div className="bg-[#8E6AA3]/12 border border-[#8E6AA3]/25 rounded-2xl px-4 py-3.5 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#8E6AA3] mt-1 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-[#FAF8F5]">
                    {pendientesTotal} reserva{pendientesTotal > 1 ? "s" : ""} pendiente{pendientesTotal > 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={() => { setTab("reservas"); setFiltroReservas("todas"); }}
                    className="text-xs text-[#8E6AA3] font-semibold mt-0.5"
                  >
                    Revisar ahora →
                  </button>
                </div>
              </div>
            )}

            {/* Próximas reservas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-[#FAF8F5]">Próximas reservas</h2>
                <button
                  onClick={() => setTab("reservas")}
                  className="text-xs text-[#8E6AA3] font-semibold flex items-center gap-0.5"
                >
                  Ver todas <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {proximasReservas.length === 0 ? (
                <div className="text-center py-8 text-[#888888]">
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
              className="flex items-center gap-4 bg-gradient-to-r from-[#8E6AA3] to-[#7A5691] text-white rounded-2xl p-4 shadow-md hover:opacity-90 transition-opacity"
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
                className="bg-[#0F0F0F] text-[#FAF8F5] rounded-2xl p-4 text-left hover:bg-[#252525] transition-colors"
              >
                <UtensilsCrossed className="w-5 h-5 text-[#8E6AA3] mb-2" />
                <p className="text-xs text-[#FAF8F5]/60">Ver estado de</p>
                <p className="text-sm font-bold">las mesas</p>
              </button>
              <Link
                href="/"
                className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-2xl p-4 text-left hover:bg-[#1F1F1F] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#8E6AA3] mb-2" />
                <p className="text-xs text-[#888888]">Ver como</p>
                <p className="text-sm font-bold text-[#FAF8F5]">cliente</p>
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
                { color: "bg-[#8E6AA3]", texto: "Próxima reserva" },
              ].map(({ color, texto }) => (
                <span key={texto} className="flex items-center gap-1.5 text-xs font-semibold text-[#888888]">
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
                  libre: { color: "text-green-400", bg: "bg-green-900/20", borde: "border-green-800/30", etiq: "Libres" },
                  ocupada: { color: "text-red-400", bg: "bg-red-900/20", borde: "border-red-800/30", etiq: "Ocupadas" },
                  proxima: { color: "text-[#8E6AA3]", bg: "bg-[#8E6AA3]/10", borde: "border-[#8E6AA3]/15", etiq: "Próximas" },
                }[e];
                return (
                  <div key={e} className={`${cfg.bg} border ${cfg.borde} rounded-2xl p-4 text-center shadow-sm`}>
                    <div className={`text-3xl font-extrabold ${cfg.color}`}>{count}</div>
                    <div className="text-[10px] text-[#888888] font-semibold mt-0.5">{cfg.etiq}</div>
                  </div>
                );
              })}
            </div>

            {/* Plano visual */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#1F1F1F] shadow-sm overflow-hidden">
              {/* Interior */}
              <div className="p-4">
                <p className="text-[10px] font-extrabold text-[#888888] uppercase tracking-widest mb-3">
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

              <div className="h-px bg-[#1F1F1F] mx-4" />

              {/* Terraza */}
              <div className="p-4">
                <p className="text-[10px] font-extrabold text-[#888888] uppercase tracking-widest mb-3">
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
                <h3 className="text-sm font-extrabold text-[#FAF8F5] mb-3">
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

        {/* ── TAB: CONFIGURACIÓN ──────────────────────────── */}
        {tab === "config" && <TabConfiguracion />}

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
                      ? "bg-[#FAF8F5] text-[#0F0F0F] shadow-sm"
                      : "bg-[#1A1A1A] text-[#FAF8F5]/60 border border-[#1F1F1F]"
                  }`}
                >
                  {etiqueta}
                  {valor === "hoy" && reservasHoy.length > 0 && (
                    <span className={`ml-1.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      filtroReservas === valor ? "bg-[#8E6AA3] text-white" : "bg-white/6 text-[#FAF8F5]"
                    }`}>
                      {reservasHoy.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Lista */}
            {reservasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-[#888888]">
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

// ── TAB CONFIGURACIÓN ──────────────────────────────────────────

function TabConfiguracion() {
  const [apiKey, setApiKey] = useState("");
  const [shopId, setShopId] = useState("");
  const [mostrarKey, setMostrarKey] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [probando, setProbando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);
  const [activandoWh, setActivandoWh] = useState(false);
  const [estado, setEstado] = useState<{ tipo: "exito" | "error" | null; mensaje: string }>({ tipo: null, mensaje: "" });
  const [estadoWh, setEstadoWh] = useState<{ tipo: "exito" | "error" | null; mensaje: string }>({ tipo: null, mensaje: "" });
  const [configActual, setConfigActual] = useState<{
    configurado: boolean;
    pancakeShopId: string;
    pancakeApiKeyPreview: string;
  } | null>(null);

  // URL del webhook de esta app
  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhooks/pancake`
    : "/api/webhooks/pancake";

  const cargarConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/configuracion");
      if (res.ok) setConfigActual(await res.json());
    } catch { /* ignorar */ }
  }, []);

  useEffect(() => { cargarConfig(); }, [cargarConfig]);

  const guardar = async () => {
    if (!apiKey.trim() || !shopId.trim()) {
      setEstado({ tipo: "error", mensaje: "Completa la API Key y el Shop ID." });
      return;
    }
    setGuardando(true);
    setEstado({ tipo: null, mensaje: "" });
    try {
      const res = await fetch("/api/admin/configuracion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pancakeApiKey: apiKey, pancakeShopId: shopId }),
      });
      if (res.ok) {
        setGuardadoOk(true);
        setApiKey("");
        setShopId("");
        await cargarConfig();
        setTimeout(() => setGuardadoOk(false), 2500);
      } else {
        setEstado({ tipo: "error", mensaje: "Error al guardar." });
      }
    } catch {
      setEstado({ tipo: "error", mensaje: "Error de conexión." });
    } finally {
      setGuardando(false);
    }
  };

  const probarConexion = async () => {
    setProbando(true);
    setEstado({ tipo: null, mensaje: "" });
    try {
      const res = await fetch("/api/admin/pancake/test");
      const datos = await res.json();
      if (datos.ok) {
        setEstado({ tipo: "exito", mensaje: `✓ Conectado — Shop: ${datos.shopId} · ${datos.totalClientes} clientes` });
      } else {
        setEstado({ tipo: "error", mensaje: datos.error ?? "Error desconocido" });
      }
    } catch {
      setEstado({ tipo: "error", mensaje: "Error de red al probar la conexión." });
    } finally {
      setProbando(false);
    }
  };

  const activarWebhook = async () => {
    setActivandoWh(true);
    setEstadoWh({ tipo: null, mensaje: "" });
    try {
      const res = await fetch("/api/admin/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "activar", webhookUrl }),
      });
      const datos = await res.json();
      if (datos.ok) {
        setEstadoWh({ tipo: "exito", mensaje: "✓ Webhook registrado en Pancake. Ya recibirás notificaciones." });
      } else {
        setEstadoWh({ tipo: "error", mensaje: datos.error ?? datos.mensaje ?? "Error al activar webhook" });
      }
    } catch {
      setEstadoWh({ tipo: "error", mensaje: "Error de conexión." });
    } finally {
      setActivandoWh(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Estado de conexión ── */}
      <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
        configActual?.configurado ? "bg-green-900/20 border-green-800/40" : "bg-[#8E6AA3]/10 border-[#8E6AA3]/25"
      }`}>
        {configActual?.configurado
          ? <Wifi className="w-5 h-5 text-green-400 flex-shrink-0" />
          : <WifiOff className="w-5 h-5 text-[#8E6AA3] flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${configActual?.configurado ? "text-green-400" : "text-[#8E6AA3]"}`}>
            {configActual?.configurado ? "Pancake CRM conectado" : "Pancake CRM no configurado"}
          </p>
          {configActual?.configurado && (
            <p className="text-xs text-[#888888] mt-0.5 font-medium">
              Shop: <span className="font-bold">{configActual.pancakeShopId}</span>
              {" · "}Key: <span className="font-mono">{configActual.pancakeApiKeyPreview}</span>
            </p>
          )}
        </div>
        {configActual?.configurado && (
          <button
            onClick={probarConexion}
            disabled={probando}
            className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-900/20 hover:bg-green-900/30 px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {probando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Probar
          </button>
        )}
      </div>

      {/* Alerta resultado test */}
      {estado.tipo && (
        <div className={`rounded-2xl border px-4 py-3 flex items-start gap-2.5 ${
          estado.tipo === "exito" ? "bg-green-900/20 border-green-800/40" : "bg-red-900/20 border-red-800/40"
        }`}>
          {estado.tipo === "exito"
            ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
          <p className={`text-sm font-medium ${estado.tipo === "exito" ? "text-green-400" : "text-red-400"}`}>
            {estado.mensaje}
          </p>
        </div>
      )}

      {/* ── Credenciales ── */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#1F1F1F] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]/60">
          <h2 className="text-sm font-extrabold text-[#FAF8F5]">Credenciales Pancake</h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Pancake → Configuración → Aplicación → API KEY
          </p>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-1.5">Shop ID</label>
            <input
              type="text"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              placeholder={configActual?.pancakeShopId ? `Actual: ${configActual.pancakeShopId}` : "ej. 123456"}
              className="w-full px-4 py-3 bg-[#141414] border border-[#1F1F1F] rounded-xl text-sm font-medium text-[#FAF8F5] placeholder:text-[#FAF8F5]/20 outline-none focus:border-[#8E6AA3] focus:ring-2 focus:ring-[#8E6AA3]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-1.5">API Key</label>
            <div className="relative">
              <input
                type={mostrarKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={configActual?.pancakeApiKeyPreview ? `Actual: ${configActual.pancakeApiKeyPreview}` : "••••••••••••••••"}
                className="w-full px-4 py-3 pr-11 bg-[#141414] border border-[#1F1F1F] rounded-xl text-sm font-medium text-[#FAF8F5] placeholder:text-[#FAF8F5]/20 outline-none focus:border-[#8E6AA3] focus:ring-2 focus:ring-[#8E6AA3]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarKey(!mostrarKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 hover:text-[#FAF8F5]/70 transition-colors"
              >
                {mostrarKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={guardar}
              disabled={guardando || guardadoOk}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                guardadoOk ? "bg-green-600 text-white" : "bg-[#141414] border border-[#1F1F1F] text-[#FAF8F5] hover:bg-[#1F1F1F] disabled:opacity-60"
              }`}
            >
              {guardando ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</>
                : guardadoOk ? <><CheckCircle2 className="w-4 h-4" />Guardado</>
                : "Guardar credenciales"}
            </button>
            {!configActual?.configurado && (
              <button
                onClick={probarConexion}
                disabled={probando}
                className="px-4 py-3 rounded-xl text-sm font-bold bg-[#141414] border border-[#1F1F1F] text-[#FAF8F5] hover:bg-[#1F1F1F] flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                {probando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                Probar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Canales de comunicación ── */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#1F1F1F] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]/60">
          <h2 className="text-sm font-extrabold text-[#FAF8F5]">Canales de comunicación</h2>
          <p className="text-xs text-[#888888] mt-0.5">
            WhatsApp · Instagram · Messenger · TikTok
          </p>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* Cómo funciona */}
          <div className="space-y-2.5">
            {[
              { icono: "📲", texto: "Cliente reserva en la web app", sub: "Sus datos se sincronizan en Pancake automáticamente" },
              { icono: "💬", texto: "Cliente escribe por WhatsApp / Instagram / etc.", sub: "El mensaje llega al inbox de Pancake con su historial de reservas" },
              { icono: "✅", texto: "Tú respondes desde Pancake", sub: "Desde tu celular, en el canal que el cliente prefiera" },
            ].map(({ icono, texto, sub }) => (
              <div key={texto} className="flex items-start gap-3 py-2 border-b border-[#1F1F1F] last:border-0">
                <span className="text-lg leading-none mt-0.5 flex-shrink-0">{icono}</span>
                <div>
                  <p className="text-xs font-bold text-[#FAF8F5]">{texto}</p>
                  <p className="text-xs text-[#888888] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Conectar canales */}
          <div className="bg-[#8E6AA3]/10 border border-[#8E6AA3]/20 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-[#FAF8F5] mb-1">Para conectar los canales</p>
            <p className="text-xs text-[#888888] leading-relaxed">
              En Pancake → <span className="font-bold">Cuentas conectadas</span> → agrega tu WhatsApp Business, página de Facebook, Instagram o TikTok.
              Una vez conectados, todas las conversaciones llegan a tu inbox de Pancake.
            </p>
          </div>
        </div>
      </div>

      {/* ── Webhook ── */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#1F1F1F] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1F1F1F]/60">
          <h2 className="text-sm font-extrabold text-[#FAF8F5]">Notificaciones en tiempo real</h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Pancake avisa a esta app cuando hay cambios
          </p>
        </div>
        <div className="px-5 py-4 space-y-4">
          {/* URL del webhook */}
          <div>
            <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-1.5">
              URL del Webhook
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={webhookUrl}
                className="flex-1 px-3 py-2.5 bg-white/4 border border-[#1F1F1F] rounded-xl text-xs font-mono text-[#FAF8F5] outline-none"
              />
              <button
                onClick={() => navigator.clipboard?.writeText(webhookUrl)}
                className="px-3 py-2.5 bg-[#141414] border border-[#1F1F1F] rounded-xl text-xs font-bold text-[#888888] hover:bg-[#1F1F1F] transition-colors flex-shrink-0"
              >
                Copiar
              </button>
            </div>
          </div>

          {/* Qué recibimos */}
          <div className="text-xs text-[#888888] leading-relaxed">
            Pancake enviará notificaciones cuando un cliente escriba por WhatsApp, Instagram, Messenger o TikTok.
            Así esta app puede mostrar el historial de chats en el perfil del cliente.
          </div>

          {/* Botón registrar */}
          {configActual?.configurado && (
            <button
              onClick={activarWebhook}
              disabled={activandoWh}
              className="w-full py-3 rounded-xl text-sm font-bold bg-[#141414] border border-[#1F1F1F] text-[#FAF8F5] hover:bg-[#1F1F1F] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {activandoWh
                ? <><Loader2 className="w-4 h-4 animate-spin" />Registrando...</>
                : <><Wifi className="w-4 h-4" />Registrar webhook en Pancake</>
              }
            </button>
          )}
          {!configActual?.configurado && (
            <p className="text-xs text-[#8E6AA3] font-semibold">
              Guarda las credenciales de Pancake primero.
            </p>
          )}

          {estadoWh.tipo && (
            <div className={`rounded-xl border px-4 py-3 flex items-start gap-2 ${
              estadoWh.tipo === "exito" ? "bg-green-900/20 border-green-800/40" : "bg-red-900/20 border-red-800/40"
            }`}>
              {estadoWh.tipo === "exito"
                ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
              <p className={`text-xs font-medium ${estadoWh.tipo === "exito" ? "text-green-400" : "text-red-400"}`}>
                {estadoWh.mensaje}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nota producción */}
      <div className="bg-white/4 rounded-2xl border border-white/8 px-4 py-3.5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#888888] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[#FAF8F5] mb-1">Para producción (Vercel)</p>
          <p className="text-xs text-[#888888] leading-relaxed">
            La config en memoria es temporal. Para producción estable agrega{" "}
            <span className="font-mono font-bold text-[#FAF8F5]">PANCAKE_API_KEY</span>{" "}y{" "}
            <span className="font-mono font-bold text-[#FAF8F5]">PANCAKE_SHOP_ID</span>{" "}
            en Vercel → Settings → Environment Variables.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── SUB-COMPONENTES ────────────────────────────────────────────

function StatCard({
  valor,
  etiqueta,
  color,
  bg,
  borde = "border-[#1F1F1F]",
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
      <div className="text-xs text-[#888888] font-semibold mt-1.5">{etiqueta}</div>
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
      bg: "bg-green-900/20",
      borde: "border-green-800/40",
      dot: "bg-green-400",
      texto: "text-green-400",
      etiq: "Libre",
    },
    ocupada: {
      bg: "bg-red-900/20",
      borde: "border-red-800/40",
      dot: "bg-red-400",
      texto: "text-red-400",
      etiq: "Ocup.",
    },
    proxima: {
      bg: "bg-[#8E6AA3]/10",
      borde: "border-[#8E6AA3]/25",
      dot: "bg-[#8E6AA3]",
      texto: "text-[#8E6AA3]",
      etiq: "Próx.",
    },
  }[estado];

  return (
    <div className={`${cfg.bg} border ${cfg.borde} rounded-xl p-2.5 text-center relative`}>
      {estado === "ocupada" && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-[#0F0F0F] animate-pulse" />
      )}
      <div className="text-base font-extrabold text-[#FAF8F5]">{mesa.numero}</div>
      <div className="flex items-center justify-center gap-0.5 my-0.5">
        <Users className="w-2.5 h-2.5 text-[#888888]" />
        <span className="text-[9px] text-[#888888] font-medium">{mesa.capacidad}</span>
      </div>
      <div className={`text-[9px] font-extrabold ${cfg.texto}`}>{cfg.etiq}</div>
      {reserva && estado !== "libre" && (
        <div className="text-[8px] text-[#888888] mt-0.5 truncate">{reserva.hora}</div>
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
    pendiente: "bg-[#8E6AA3] animate-pulse",
    cancelada: "bg-red-400",
  }[reserva.estado];

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-[#1F1F1F] shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${estadoDot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-[#FAF8F5] truncate">
            {reserva.nombreCliente}
          </span>
          <span className="text-xs text-[#8E6AA3] font-bold flex-shrink-0">{reserva.hora}</span>
          <span className="text-xs text-[#888888] flex-shrink-0">
            {formatearFechaEtiqueta(reserva.fecha)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888888] mt-0.5">
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
            className="w-8 h-8 bg-green-900/20 border border-green-800/40 rounded-xl flex items-center justify-center hover:bg-green-900/30 transition-colors"
            title="Confirmar"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </button>
        )}
        {reserva.estado !== "cancelada" && (
          <button
            onClick={() => onCancelar(reserva.id)}
            className="w-8 h-8 bg-red-900/20 border border-red-800/40 rounded-xl flex items-center justify-center hover:bg-red-900/30 transition-colors"
            title="Cancelar"
          >
            <XCircle className="w-4 h-4 text-red-400" />
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
      color: "text-green-400",
      bg: "bg-green-900/20",
      borde: "border-green-800/40",
      cardBorde: "border-green-800/40",
    },
    pendiente: {
      label: "Pendiente",
      dot: "bg-[#8E6AA3] animate-pulse",
      color: "text-[#8E6AA3]",
      bg: "bg-[#8E6AA3]/10",
      borde: "border-[#8E6AA3]/20",
      cardBorde: "border-[#8E6AA3]/20",
    },
    cancelada: {
      label: "Cancelada",
      dot: "bg-red-400",
      color: "text-red-400",
      bg: "bg-red-900/20",
      borde: "border-red-800/40",
      cardBorde: "border-red-800/40",
    },
  }[reserva.estado];

  return (
    <div className={`bg-[#1A1A1A] rounded-2xl border ${estadoCfg.cardBorde} shadow-sm overflow-hidden`}>
      {/* Cabecera */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-[#FAF8F5] truncate">
              {reserva.nombreCliente}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-[#888888]">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{reserva.email}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-[#888888]">
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
        <div className="flex border-t border-[#1F1F1F]/60">
          {reserva.estado === "pendiente" && (
            <button
              onClick={() => onConfirmar(reserva.id)}
              className="flex-1 py-3 flex items-center justify-center gap-1.5 text-green-400 text-xs font-extrabold hover:bg-green-900/20 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar reserva
            </button>
          )}
          <button
            onClick={() => onCancelar(reserva.id)}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-red-400 text-xs font-extrabold hover:bg-red-900/20 transition-colors ${
              reserva.estado === "confirmada" ? "border-l border-[#1F1F1F]/60" : ""
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
      <Icon className="w-3.5 h-3.5 text-[#8E6AA3] flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-[9px] text-[#888888] font-bold uppercase tracking-wider">{etiqueta}</p>
        <p className={`text-xs font-semibold text-[#FAF8F5] ${capitalize ? "capitalize" : ""}`}>
          {valor}
        </p>
      </div>
    </div>
  );
}
