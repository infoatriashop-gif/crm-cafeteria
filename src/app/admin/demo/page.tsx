"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Coffee,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Users,
  MapPin,
  Bell,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Phone,
  Smartphone,
  Award,
} from "lucide-react";

// ── Duración de cada paso (ms) ─────────────────────────────────
const DURACION = 4200;

// ── Definición de pasos ────────────────────────────────────────
const PASOS = [
  {
    quien: "cliente" as const,
    emoji: "☕",
    titulo: "El cliente descubre tu café en Google",
    descripcion:
      'Son las 6pm. Valentina busca "cafetería Chapinero Bogotá" y encuentra tu web. Entra, ve el menú y las fotos. Le encanta.',
    detalle: "Sin intermediarios. Tu café, visible 24/7.",
  },
  {
    quien: "cliente" as const,
    emoji: "📅",
    titulo: "Elige cuándo visitarte — sin llamarte",
    descripcion:
      "Desde su celular, Valentina escoge el miércoles a las 7pm. Ve los horarios disponibles al instante. Sin esperar que contestes.",
    detalle: "Reservas recibidas aunque estés atendiendo mesas.",
  },
  {
    quien: "cliente" as const,
    emoji: "🪑",
    titulo: "Escoge su mesa favorita",
    descripcion:
      'Ve el plano de tu cafetería. "¡Quiero la mesa 11 de la terraza!" — la selecciona en un toque.',
    detalle: "El sistema evita que dos personas reserven la misma mesa.",
  },
  {
    quien: "cliente" as const,
    emoji: "✍️",
    titulo: "Llena sus datos en 30 segundos",
    descripcion:
      "Nombre, teléfono, email. Nada más. El sistema es tan rápido que Valentina confirma antes de que acabe su tinto.",
    detalle: "Formulario optimizado para móvil. Cero fricciones.",
  },
  {
    quien: "cliente" as const,
    emoji: "🎉",
    titulo: "¡Reserva confirmada al instante!",
    descripcion:
      "Valentina recibe su número de reserva #RES-V4L3. Le llega el resumen. Ella ya sabe que su mesa la espera.",
    detalle: "Cero llamadas de ida y vuelta. Cero malentendidos.",
  },
  {
    quien: "admin" as const,
    emoji: "🔔",
    titulo: "Tú ves la nueva reserva en tu celular",
    descripcion:
      "Estás atendiendo una mesa cuando llega la reserva de Valentina. Tu panel te muestra todo: quién es, cuándo viene, qué mesa eligió.",
    detalle: "Desde cualquier lugar de Bogotá. Solo necesitas tu celular.",
  },
  {
    quien: "admin" as const,
    emoji: "✅",
    titulo: "Confirmas con un solo toque",
    descripcion:
      'Tocas "Confirmar". Listo. Valentina sabe que está todo bien. Tú sigues atendiendo sin interrumpir tu trabajo.',
    detalle: "Lo que antes tomaba 5 minutos de llamada, ahora es 1 segundo.",
  },
  {
    quien: "admin" as const,
    emoji: "📊",
    titulo: "Controlas todo tu negocio desde aquí",
    descripcion:
      "Ves qué mesas están ocupadas, cuáles vienen, cuántas reservas tienes esta semana. Todo en una pantalla.",
    detalle: "Información en tiempo real. Decisiones más inteligentes.",
  },
  {
    quien: "exito" as const,
    emoji: "🏆",
    titulo: "Valentina llega. Su mesa la espera. Ella sonríe.",
    descripcion:
      "Sin confusión, sin buscar la reserva en un cuaderno, sin sorpresas. La experiencia perfecta — desde el celular hasta la mesa.",
    detalle: "Eso es lo que construimos juntos para tu cafetería. 🚀",
  },
];

// ── Pantallas del teléfono por paso ───────────────────────────
function PantallaLanding() {
  return (
    <div className="h-full bg-[#FDF6EC] flex flex-col">
      <div
        className="flex-1 flex flex-col justify-end p-4 min-h-[160px]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(200,133,42,0.4) 0%, transparent 60%), linear-gradient(160deg, #1a0e08 0%, #2C1810 50%, #3d2010 100%)",
        }}
      >
        <div className="w-8 h-8 bg-[#8E6AA3]/25 rounded-xl flex items-center justify-center mb-2 border border-[#8E6AA3]/30">
          <Coffee className="w-4 h-4 text-[#8E6AA3]" />
        </div>
        <p className="text-[#8E6AA3] text-[10px] font-bold mb-1">Chapinero, Bogotá</p>
        <h2 className="text-white text-sm font-extrabold leading-tight mb-2">
          Reserva tu<br />mesa perfecta
        </h2>
        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-[9px] font-bold px-2 py-1 rounded-full border border-green-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Abierto · Cierra 22:00
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          {["12 mesas", "Terraza", "Interior"].map((t) => (
            <div key={t} className="bg-white rounded-xl p-2 text-center shadow-sm border border-[#E8D5B7]/60">
              <div className="text-[9px] font-bold text-[#2C1810]">{t}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#8E6AA3] text-white text-center py-2.5 rounded-full text-[11px] font-extrabold shadow-sm">
          Reservar mesa →
        </div>
      </div>
    </div>
  );
}

function PantallaFecha() {
  return (
    <div className="h-full bg-[#FDF6EC] p-3 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#2C1810]/10 rounded-full flex items-center justify-center">
          <ArrowLeft className="w-2.5 h-2.5 text-[#2C1810]" />
        </div>
        <span className="text-[11px] font-extrabold text-[#2C1810]">¿Cuándo visitarás?</span>
      </div>
      <div className="flex gap-1.5 overflow-hidden">
        {["Hoy", "Mié 4", "Jue 5", "Vie 6"].map((d, i) => (
          <div
            key={d}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[9px] font-bold ${
              i === 1 ? "bg-[#2C1810] text-white" : "bg-white text-[#2C1810]/60 border border-[#E8D5B7]"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { h: "12:00", ok: true }, { h: "13:00", ok: true },
          { h: "14:00", ok: false }, { h: "19:00", ok: true },
          { h: "20:00", ok: true }, { h: "21:00", ok: false },
        ].map(({ h, ok }) => (
          <div
            key={h}
            className={`p-2 rounded-xl text-center border ${
              ok ? "bg-white border-[#E8D5B7]" : "bg-[#2C1810]/5 border-transparent opacity-50"
            }`}
          >
            <div className={`text-[11px] font-extrabold ${ok ? "text-[#2C1810]" : "text-[#2C1810]/30"}`}>{h}</div>
            <div className={`text-[8px] font-bold ${ok ? "text-green-600" : "text-red-400"}`}>
              {ok ? "Disponible" : "Lleno"}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#8E6AA3] text-white text-center py-2 rounded-full text-[10px] font-extrabold mt-auto">
        Siguiente →
      </div>
    </div>
  );
}

function PantallaMesa() {
  return (
    <div className="h-full bg-[#FDF6EC] p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-3 h-3 text-[#2C1810]" />
        <span className="text-[11px] font-extrabold text-[#2C1810]">Elegir Mesa</span>
      </div>
      <div className="flex gap-1">
        {[
          { l: "Todas", a: true }, { l: "Interior", a: false }, { l: "Terraza", a: false }
        ].map(({ l, a }) => (
          <div key={l} className={`px-2 py-1 rounded-full text-[8px] font-bold ${a ? "bg-[#2C1810] text-white" : "bg-white text-[#2C1810]/60 border border-[#E8D5B7]"}`}>{l}</div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-2.5 shadow-sm border border-[#E8D5B7]/60">
        <p className="text-[8px] font-extrabold text-[#7A5C44] uppercase tracking-wider mb-1.5">Interior</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { n: 1, ok: true, sel: false }, { n: 2, ok: true, sel: false },
            { n: 3, ok: false, sel: false }, { n: 4, ok: true, sel: false },
            { n: 5, ok: true, sel: false }, { n: 6, ok: true, sel: false },
            { n: 7, ok: true, sel: false }, { n: 8, ok: true, sel: false },
          ].map(({ n, ok, sel }) => (
            <div key={n} className={`p-1.5 rounded-lg text-center text-[8px] font-extrabold border ${sel ? "bg-[#8E6AA3]/15 border-[#8E6AA3] text-[#8E6AA3]" : ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-400"}`}>{n}</div>
          ))}
        </div>
        <p className="text-[8px] font-extrabold text-[#7A5C44] uppercase tracking-wider mb-1.5 mt-2">Terraza</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { n: 9, ok: true }, { n: 10, ok: true },
            { n: 11, ok: true, sel: true }, { n: 12, ok: true },
          ].map(({ n, ok, sel }: { n: number; ok: boolean; sel?: boolean }) => (
            <div key={n} className={`p-1.5 rounded-lg text-center text-[8px] font-extrabold border ${sel ? "bg-[#8E6AA3]/15 border-[#8E6AA3] text-[#8E6AA3]" : ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-400"}`}>{n}</div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#8E6AA3]/12 rounded-xl px-2.5 py-2 border border-[#8E6AA3]/25">
        <CheckCircle2 className="w-3 h-3 text-[#8E6AA3]" />
        <span className="text-[9px] font-bold text-[#2C1810]">Mesa 11 · Terraza · 4 pax</span>
      </div>
      <div className="bg-[#8E6AA3] text-white text-center py-2 rounded-full text-[10px] font-extrabold">
        Confirmar selección →
      </div>
    </div>
  );
}

function PantallaDatos() {
  return (
    <div className="h-full bg-[#FDF6EC] p-3 flex flex-col gap-2.5">
      <span className="text-[11px] font-extrabold text-[#2C1810]">Tus datos</span>
      <div className="bg-white rounded-xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">
        {[
          { label: "Nombre", val: "Valentina García" },
          { label: "Email", val: "vale.garcia@gmail.com" },
          { label: "Teléfono", val: "+57 300 123 4567" },
        ].map(({ label, val }, i, arr) => (
          <div key={label}>
            <div className="px-3 py-2.5">
              <div className="text-[8px] font-extrabold text-[#7A5C44] uppercase tracking-wider">{label}</div>
              <div className="text-[10px] font-bold text-[#2C1810] mt-0.5">{val}</div>
            </div>
            {i < arr.length - 1 && <div className="h-px bg-[#E8D5B7]/60 mx-3" />}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#E8D5B7]/80 shadow-sm overflow-hidden">
        {[
          { label: "Fecha", val: "Mié 4 mar · 19:00" },
          { label: "Mesa", val: "Mesa 11 · Terraza" },
          { label: "Personas", val: "2 comensales" },
        ].map(({ label, val }, i, arr) => (
          <div key={label}>
            <div className="px-3 py-2">
              <div className="text-[8px] font-extrabold text-[#7A5C44] uppercase tracking-wider">{label}</div>
              <div className="text-[10px] font-bold text-[#8E6AA3] mt-0.5">{val}</div>
            </div>
            {i < arr.length - 1 && <div className="h-px bg-[#E8D5B7]/60 mx-3" />}
          </div>
        ))}
      </div>
      <div className="bg-[#1A5C3A] text-white text-center py-2.5 rounded-full text-[10px] font-extrabold shadow-sm">
        ✓ Confirmar reserva
      </div>
    </div>
  );
}

function PantallaExito() {
  return (
    <div className="h-full bg-[#FDF6EC] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-[#1A5C3A]/12 rounded-full flex items-center justify-center mb-3">
        <div className="w-11 h-11 bg-[#1A5C3A]/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-[#1A5C3A]" />
        </div>
      </div>
      <h3 className="text-sm font-extrabold text-[#2C1810] mb-1">¡Reserva lista! 🎉</h3>
      <p className="text-[9px] text-[#7A5C44] mb-3">Recibiste los detalles por email</p>
      <div className="bg-[#8E6AA3]/15 text-[#8E6AA3] font-extrabold text-xs px-4 py-2 rounded-full mb-3">
        #RES-V4L3
      </div>
      <div className="bg-white rounded-xl border border-[#E8D5B7] w-full p-3 text-left space-y-1.5">
        {[
          { icon: "📅", txt: "Mié 4 marzo · 19:00" },
          { icon: "🪑", txt: "Mesa 11 · Terraza" },
          { icon: "👥", txt: "2 personas · 90 min" },
        ].map(({ icon, txt }) => (
          <div key={txt} className="flex items-center gap-2 text-[9px] font-semibold text-[#2C1810]">
            <span>{icon}</span>{txt}
          </div>
        ))}
      </div>
    </div>
  );
}

function PantallaAdminNotif() {
  return (
    <div className="h-full bg-[#FDF6EC] flex flex-col">
      <div className="bg-[#2C1810] px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#8E6AA3] rounded-lg flex items-center justify-center">
            <Coffee className="w-3 h-3 text-white" />
          </div>
          <span className="text-[10px] font-extrabold text-white">Panel Admin</span>
        </div>
        <div className="relative">
          <Bell className="w-4 h-4 text-white/60" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8E6AA3] rounded-full animate-pulse" />
        </div>
      </div>
      <div className="p-3 space-y-2 flex-1">
        <div className="bg-[#8E6AA3]/12 border border-[#8E6AA3]/30 rounded-xl p-2.5 animate-pulse">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8E6AA3]" />
            <span className="text-[8px] font-extrabold text-[#8E6AA3] uppercase tracking-wider">🔔 Nueva reserva</span>
          </div>
          <p className="text-[10px] font-extrabold text-[#2C1810]">Valentina García</p>
          <p className="text-[9px] text-[#7A5C44]">Mié 4 mar · 19:00 · Mesa 11 · 2 pax</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { n: "8", l: "Hoy", c: "text-[#2C1810]" },
            { n: "3", l: "Pendientes", c: "text-[#8E6AA3]" },
            { n: "5", l: "Mesas libres", c: "text-[#1A5C3A]" },
            { n: "27", l: "Esta semana", c: "text-[#2C1810]" },
          ].map(({ n, l, c }) => (
            <div key={l} className="bg-white rounded-xl p-2 shadow-sm border border-[#E8D5B7]/60 text-center">
              <div className={`text-base font-extrabold ${c}`}>{n}</div>
              <div className="text-[8px] text-[#7A5C44]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PantallaAdminConfirmar() {
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConfirmado(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-full bg-[#FDF6EC] flex flex-col">
      <div className="bg-[#2C1810] px-3 py-3 flex items-center gap-2">
        <div className="w-6 h-6 bg-[#8E6AA3] rounded-lg flex items-center justify-center">
          <Coffee className="w-3 h-3 text-white" />
        </div>
        <span className="text-[10px] font-extrabold text-white">Reservas · Hoy</span>
      </div>
      <div className="p-3 flex-1">
        <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-700 ${confirmado ? "border-green-200" : "border-[#8E6AA3]/30"}`}>
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-[10px] font-extrabold text-[#2C1810]">Valentina García</p>
                <p className="text-[8px] text-[#7A5C44]">+57 300 123 4567</p>
              </div>
              <span className={`text-[8px] font-extrabold px-2 py-1 rounded-full transition-all duration-700 ${confirmado ? "bg-green-100 text-green-700" : "bg-[#8E6AA3]/12 text-[#8E6AA3]"}`}>
                {confirmado ? "✓ Confirmada" : "⏳ Pendiente"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[["📅", "Mié 4"], ["🕖", "19:00"], ["👥", "2 pax"]].map(([ic, tx]) => (
                <div key={tx} className="bg-[#FDF6EC] rounded-lg p-1.5">
                  <div className="text-sm">{ic}</div>
                  <div className="text-[8px] font-bold text-[#2C1810]">{tx}</div>
                </div>
              ))}
            </div>
          </div>
          {!confirmado ? (
            <div className="flex border-t border-[#E8D5B7]/60">
              <div className="flex-1 py-2.5 flex items-center justify-center gap-1 bg-green-50 text-green-700 text-[9px] font-extrabold">
                <CheckCircle2 className="w-3 h-3" />
                <span className="animate-bounce">TAP para confirmar</span>
              </div>
              <div className="flex-1 py-2.5 flex items-center justify-center gap-1 text-red-500 text-[9px] font-extrabold border-l border-[#E8D5B7]/60">
                <XCircle className="w-3 h-3" /> Cancelar
              </div>
            </div>
          ) : (
            <div className="py-2.5 flex items-center justify-center gap-1.5 bg-green-50 border-t border-green-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[9px] font-extrabold text-green-700">¡Confirmada con 1 toque! ✨</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PantallaAdminDashboard() {
  return (
    <div className="h-full bg-[#FDF6EC] flex flex-col">
      <div className="bg-[#2C1810] px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#8E6AA3] rounded-lg flex items-center justify-center">
              <Coffee className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] font-extrabold text-white">Panel Admin</span>
          </div>
          <Smartphone className="w-3.5 h-3.5 text-[#8E6AA3]" />
        </div>
        <div className="flex gap-1">
          {["Resumen", "Mesas", "Reservas"].map((t, i) => (
            <div key={t} className={`px-2 py-1 text-[8px] font-bold rounded-full ${i === 0 ? "bg-[#8E6AA3] text-white" : "text-white/40"}`}>{t}</div>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-2 overflow-hidden">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { n: "27", l: "Esta semana 🔥", c: "text-[#8E6AA3]", bg: "bg-white" },
            { n: "5", l: "Pendientes ⚡", c: "text-amber-600", bg: "bg-amber-50" },
            { n: "9", l: "Mesas libres ✅", c: "text-[#1A5C3A]", bg: "bg-green-50" },
            { n: "3", l: "Ocupadas ahora 🔴", c: "text-red-600", bg: "bg-red-50" },
          ].map(({ n, l, c, bg }) => (
            <div key={l} className={`${bg} rounded-xl p-2 shadow-sm border border-[#E8D5B7]/40 text-center`}>
              <div className={`text-xl font-extrabold ${c}`}>{n}</div>
              <div className="text-[7px] text-[#7A5C44] leading-tight mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-2 shadow-sm border border-[#E8D5B7]/60">
          <p className="text-[8px] font-extrabold text-[#7A5C44] uppercase mb-1.5">Próximas hoy</p>
          {[
            { n: "Valentina G.", h: "19:00", ok: true },
            { n: "Isabella R.", h: "19:30", ok: false },
            { n: "Andrés O.", h: "20:00", ok: true },
          ].map(({ n, h, ok }) => (
            <div key={n} className="flex items-center justify-between py-1 border-b border-[#E8D5B7]/40 last:border-0">
              <span className="text-[9px] font-bold text-[#2C1810]">{n}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-[#8E6AA3] font-bold">{h}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-[#8E6AA3] animate-pulse"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PantallaExitoFinal() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center"
      style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(200,133,42,0.25) 0%, transparent 65%), linear-gradient(160deg, #1a0e08 0%, #2C1810 100%)" }}
    >
      <div className="text-4xl mb-3">🏆</div>
      <h3 className="text-sm font-extrabold text-white mb-2 leading-tight">
        Valentina llegó.<br />Su mesa la esperaba.
      </h3>
      <p className="text-[9px] text-[#FDF6EC]/60 mb-4">Sin confusión · Sin llamadas · Sin cuadernos</p>
      <div className="space-y-1.5 w-full">
        {[
          "📞 0 llamadas recibidas",
          "⏱ 30 seg para reservar",
          "✅ Mesa lista al llegar",
          "😊 Cliente feliz, repite",
        ].map((t) => (
          <div key={t} className="bg-white/10 backdrop-blur rounded-lg px-3 py-1.5 text-[9px] font-bold text-white/90 text-left">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

const PANTALLAS = [
  <PantallaLanding key="landing" />,
  <PantallaFecha key="fecha" />,
  <PantallaMesa key="mesa" />,
  <PantallaDatos key="datos" />,
  <PantallaExito key="exito" />,
  <PantallaAdminNotif key="notif" />,
  <PantallaAdminConfirmar key="confirmar" />,
  <PantallaAdminDashboard key="dashboard" />,
  <PantallaExitoFinal key="final" />,
];

// ── Beneficios: antes vs después ──────────────────────────────
const BENEFICIOS = [
  {
    antes: { emoji: "📞", titulo: "3+ horas a la semana", desc: "Atendiendo reservas por teléfono mientras servías mesas" },
    despues: { emoji: "📱", titulo: "5 min desde tu celular", desc: "Revisas el panel, confirmas todo y sigues con tu negocio" },
  },
  {
    antes: { emoji: "😰", titulo: "Mesas doble reservadas", desc: "Clientes molestos al llegar y encontrar su mesa tomada" },
    despues: { emoji: "✅", titulo: "Cero conflictos", desc: "El sistema bloquea automáticamente cada mesa reservada" },
  },
  {
    antes: { emoji: "📋", titulo: "Cuaderno de reservas", desc: "Si se perdía, se mojaba o no estaba, perdías toda la info" },
    despues: { emoji: "☁️", titulo: "Todo en la nube", desc: "Accesible desde cualquier celular, 24/7, sin riesgo de pérdida" },
  },
  {
    antes: { emoji: "❌", titulo: "Reservas perdidas", desc: "Llamadas a las 2am, fines de semana, o cuando no podías contestar" },
    despues: { emoji: "🎯", titulo: "Reservas automáticas", desc: "Los clientes reservan solos aunque estés durmiendo o en vacaciones" },
  },
];

// ── Componente principal ───────────────────────────────────────
export default function DemoPage() {
  const [pasoActual, setPasoActual] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [completado, setCompletado] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progresoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciarProgreso = () => {
    setProgreso(0);
    if (progresoRef.current) clearInterval(progresoRef.current);
    progresoRef.current = setInterval(() => {
      setProgreso((p) => {
        if (p >= 100) { clearInterval(progresoRef.current!); return 100; }
        return p + 100 / (DURACION / 50);
      });
    }, 50);
  };

  useEffect(() => {
    if (!reproduciendo || completado) return;
    iniciarProgreso();
    intervaloRef.current = setInterval(() => {
      setPasoActual((prev) => {
        if (prev >= PASOS.length - 1) {
          setCompletado(true);
          setReproduciendo(false);
          clearInterval(intervaloRef.current!);
          clearInterval(progresoRef.current!);
          return prev;
        }
        return prev + 1;
      });
      iniciarProgreso();
    }, DURACION);

    return () => {
      clearInterval(intervaloRef.current!);
      clearInterval(progresoRef.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reproduciendo, completado]);

  const irA = (n: number) => {
    clearInterval(intervaloRef.current!);
    clearInterval(progresoRef.current!);
    setCompletado(false);
    setPasoActual(n);
    if (reproduciendo) {
      iniciarProgreso();
      intervaloRef.current = setInterval(() => {
        setPasoActual((prev) => {
          if (prev >= PASOS.length - 1) {
            setCompletado(true); setReproduciendo(false);
            clearInterval(intervaloRef.current!); clearInterval(progresoRef.current!);
            return prev;
          }
          return prev + 1;
        });
        iniciarProgreso();
      }, DURACION);
    }
  };

  const anterior = () => irA(Math.max(0, pasoActual - 1));
  const siguiente = () => irA(Math.min(PASOS.length - 1, pasoActual + 1));

  const reiniciar = () => {
    clearInterval(intervaloRef.current!);
    clearInterval(progresoRef.current!);
    setCompletado(false);
    setReproduciendo(true);
    setPasoActual(0);
  };

  const togglePlay = () => {
    setReproduciendo((r) => !r);
    if (reproduciendo) {
      clearInterval(intervaloRef.current!);
      clearInterval(progresoRef.current!);
    }
  };

  const paso = PASOS[pasoActual];

  return (
    <div className="min-h-screen bg-[#0F0F0F] font-[family-name:var(--font-manrope)]">

      {/* ── HEADER ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5 px-5 py-4 flex items-center gap-3">
        <Link href="/admin" className="w-8 h-8 bg-white/8 rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </Link>
        <div className="flex-1">
          <h1 className="text-sm font-extrabold text-white">🎬 Demo del sistema</h1>
          <p className="text-[10px] text-white/40 font-medium">Así funciona Café Orquídea Real 24/7</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#8E6AA3]/15 px-3 py-1.5 rounded-full border border-[#8E6AA3]/25">
          <Smartphone className="w-3 h-3 text-[#8E6AA3]" />
          <span className="text-[10px] font-bold text-[#8E6AA3]">Solo tu celular</span>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4 text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#8E6AA3]/15 border border-[#8E6AA3]/25 px-4 py-2 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5 text-[#8E6AA3]" />
          <span className="text-xs font-bold text-[#8E6AA3]">Ve el proceso completo en vivo</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2">
          Tu cafetería en<br />
          <span className="text-[#8E6AA3]">piloto automático 🚀</span>
        </h2>
        <p className="text-sm text-white/50 leading-relaxed">
          Del celular del cliente a tu panel de control — sin llamadas, sin cuadernos, sin estrés.
        </p>
      </div>

      {/* ── ANIMACIÓN PRINCIPAL ───────────────────────────── */}
      <section className="px-5 max-w-lg mx-auto space-y-5">

        {/* Indicador de pasos */}
        <div className="flex gap-1">
          {PASOS.map((p, i) => (
            <button
              key={i}
              onClick={() => irA(i)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < pasoActual ? "bg-[#8E6AA3]" :
                i === pasoActual ? "bg-[#8E6AA3]" : "bg-white/12"
              }`}
            />
          ))}
        </div>

        {/* Barra de progreso del paso actual */}
        <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8E6AA3]/60 transition-none rounded-full"
            style={{ width: `${reproduciendo ? progreso : (pasoActual / (PASOS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Badge quién lo hace */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full ${
            paso.quien === "cliente"
              ? "bg-blue-500/15 text-blue-300 border border-blue-500/25"
              : paso.quien === "admin"
              ? "bg-[#8E6AA3]/20 text-[#8E6AA3] border border-[#8E6AA3]/30"
              : "bg-green-500/15 text-green-300 border border-green-500/25"
          }`}>
            {paso.quien === "cliente" ? "👤 Cliente" : paso.quien === "admin" ? "👨‍💼 Tú (Admin)" : "🎉 Resultado"}
          </span>
          <span className="text-2xl">{paso.emoji}</span>
          <span className="text-xs font-bold text-white/35">
            {pasoActual + 1} de {PASOS.length}
          </span>
        </div>

        {/* TELÉFONO MOCKUP */}
        <div className="flex justify-center">
          <div className="relative" style={{ width: 252, height: 500 }}>
            {/* Cuerpo del teléfono */}
            <div className="absolute inset-0 rounded-[44px] border-[6px] border-[#3d2410] shadow-2xl"
              style={{ background: "linear-gradient(135deg, #2C1810 0%, #1a0e08 100%)" }}
            />
            {/* Pantalla */}
            <div className="absolute top-[6px] left-[6px] right-[6px] bottom-[6px] bg-[#FDF6EC] rounded-[38px] overflow-hidden">
              {/* Status bar */}
              <div className="bg-[#2C1810] h-7 flex items-center justify-between px-4 flex-shrink-0">
                <span className="text-[10px] text-white/50 font-semibold">9:41</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-2 border border-white/40 rounded-sm relative">
                    <div className="absolute inset-0.5 bg-white/70 rounded-sm" style={{ right: "30%" }} />
                  </div>
                </div>
              </div>
              {/* Contenido animado */}
              <div
                key={pasoActual}
                className="flex-1 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500"
                style={{ height: "calc(100% - 28px)" }}
              >
                {PANTALLAS[pasoActual]}
              </div>
            </div>
            {/* Indicador home */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full" />
            {/* Botones laterales */}
            <div className="absolute right-[-3px] top-24 w-1 h-8 bg-[#3d2410] rounded-l-sm" />
            <div className="absolute left-[-3px] top-20 w-1 h-6 bg-[#3d2410] rounded-r-sm" />
            <div className="absolute left-[-3px] top-28 w-1 h-6 bg-[#3d2410] rounded-r-sm" />
          </div>
        </div>

        {/* Descripción del paso */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5 space-y-2">
          <h3 className="text-base font-extrabold text-white leading-tight">{paso.titulo}</h3>
          <p className="text-sm text-white/60 leading-relaxed">{paso.descripcion}</p>
          <div className="flex items-start gap-2 pt-1">
            <Zap className="w-3.5 h-3.5 text-[#8E6AA3] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#8E6AA3] font-bold">{paso.detalle}</p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={anterior}
            disabled={pasoActual === 0}
            className="w-11 h-11 bg-white/8 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/15 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={completado ? reiniciar : togglePlay}
            className="w-14 h-14 bg-[#8E6AA3] rounded-full flex items-center justify-center shadow-lg hover:bg-[#7A5691] transition-colors"
          >
            {completado ? (
              <RotateCcw className="w-6 h-6 text-white" />
            ) : reproduciendo ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>
          <button
            onClick={siguiente}
            disabled={pasoActual >= PASOS.length - 1}
            className="w-11 h-11 bg-white/8 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/15 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {completado && (
          <div className="text-center">
            <p className="text-xs text-white/40">¿Quieres verlo de nuevo? Toca el botón ↑</p>
          </div>
        )}
      </section>

      {/* ── SECCIÓN BENEFICIOS ────────────────────────────── */}
      <section className="mt-12 bg-[#FDF6EC] px-5 py-10">
        <div className="max-w-lg mx-auto space-y-8">

          {/* Título */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#8E6AA3]/15 border border-[#8E6AA3]/25 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-[#8E6AA3]" />
              <span className="text-xs font-bold text-[#8E6AA3]">Transformación real</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#2C1810] leading-tight">
              De esto 😩 a esto 🚀<br />
              <span className="text-[#8E6AA3]">en tu cafetería</span>
            </h2>
          </div>

          {/* Comparaciones antes/después */}
          {BENEFICIOS.map((b, i) => (
            <div key={i} className="space-y-2">
              {/* Antes */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-400 rounded-l-2xl" />
                <div className="pl-3">
                  <p className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider mb-1">😩 Antes</p>
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl flex-shrink-0">{b.antes.emoji}</span>
                    <div>
                      <p className="text-sm font-extrabold text-red-700 line-through opacity-70">{b.antes.titulo}</p>
                      <p className="text-xs text-red-600/70 mt-0.5">{b.antes.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Flecha */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-0.5 h-3 bg-[#8E6AA3]/40" />
                  <div className="w-4 h-4 bg-[#8E6AA3] rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] font-extrabold">↓</span>
                  </div>
                </div>
              </div>
              {/* Después */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-400 rounded-l-2xl" />
                <div className="pl-3">
                  <p className="text-[10px] font-extrabold text-green-600 uppercase tracking-wider mb-1">🚀 Con Café Orquídea Real App</p>
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl flex-shrink-0">{b.despues.emoji}</span>
                    <div>
                      <p className="text-sm font-extrabold text-green-700">{b.despues.titulo}</p>
                      <p className="text-xs text-green-600/80 mt-0.5">{b.despues.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Números impactantes */}
          <div className="bg-[#2C1810] rounded-3xl p-6 text-center space-y-5">
            <h3 className="text-lg font-extrabold text-white">
              📊 Lo que esto significa para ti
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: "3h", sub: "semanales ahorradas en llamadas", emoji: "⏰" },
                { num: "0", sub: "reservas perdidas por teléfono no contestado", emoji: "📞" },
                { num: "24/7", sub: "tu cafetería acepta reservas aunque duermas", emoji: "🌙" },
                { num: "100%", sub: "desde tu celular, sin computador", emoji: "📲" },
              ].map(({ num, sub, emoji }) => (
                <div key={num} className="bg-white/8 rounded-2xl p-4 border border-white/8">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-2xl font-extrabold text-[#8E6AA3]">{num}</div>
                  <div className="text-[9px] text-white/50 leading-tight mt-1">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Énfasis mobile */}
          <div className="bg-gradient-to-br from-[#8E6AA3]/15 to-[#8E6AA3]/5 border border-[#8E6AA3]/25 rounded-3xl p-6 text-center">
            <div className="text-5xl mb-3">📲</div>
            <h3 className="text-xl font-extrabold text-[#2C1810] mb-2">
              Todo. Desde. Tu. Celular.
            </h3>
            <p className="text-sm text-[#7A5C44] leading-relaxed mb-4">
              Estés en la cocina, en casa o en cualquier lugar de Bogotá — tu cafetería funciona sola y tú tienes el control en tu bolsillo.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { emoji: "✅", txt: "Ver reservas" },
                { emoji: "🪑", txt: "Estado mesas" },
                { emoji: "🔔", txt: "Notificaciones" },
                { emoji: "✓", txt: "Confirmar" },
                { emoji: "✗", txt: "Cancelar" },
                { emoji: "📊", txt: "Estadísticas" },
              ].map(({ emoji, txt }) => (
                <div key={txt} className="bg-white rounded-xl py-2.5 px-1 text-center shadow-sm border border-[#E8D5B7]/60">
                  <div className="text-lg">{emoji}</div>
                  <div className="text-[9px] font-bold text-[#2C1810] mt-0.5">{txt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial ficticio */}
          <div className="bg-white border border-[#E8D5B7] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#8E6AA3] text-[#8E6AA3]" />
              ))}
            </div>
            <p className="text-sm text-[#2C1810] leading-relaxed italic mb-3">
              &ldquo;Antes perdía 1 o 2 reservas por semana porque no contestaba el teléfono. Ahora los clientes reservan solos y yo veo todo desde mi cel. Me cambió el negocio.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8E6AA3]/20 rounded-full flex items-center justify-center">
                <Coffee className="w-4 h-4 text-[#8E6AA3]" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#2C1810]">Propietario de cafetería</p>
                <p className="text-[10px] text-[#7A5C44]">Bogotá, Colombia · Usuario del sistema</p>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="space-y-3">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#2C1810] text-white font-extrabold text-base rounded-full shadow-lg hover:bg-[#252525] transition-colors"
            >
              <Award className="w-5 h-5 text-[#8E6AA3]" />
              Ir al panel de control
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#8E6AA3] text-white font-extrabold text-base rounded-full shadow-lg hover:bg-[#7A5691] transition-colors"
            >
              <Smartphone className="w-5 h-5" />
              Ver cómo lo ve el cliente
            </Link>
            <p className="text-center text-xs text-[#7A5C44]">
              🔒 Sistema seguro · ☁️ En la nube · 📲 100% mobile
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
