import Link from "next/link";
import {
  Coffee,
  Bell,
  Home,
  CalendarDays,
  Search,
  User,
  CheckCircle2,
  MapPin,
  Clock,
  Users,
  Phone,
  ChevronRight,
  Star,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Heart,
  Quote,
} from "lucide-react";
import { infoNegocio, totalMesasInterior, totalMesasTerraza, mesas } from "@/lib/datos-demo";

function obtenerProximasFechas() {
  const dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const hoy = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    return {
      etiqueta: i === 0 ? "Hoy" : i === 1 ? "Manana" : `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`,
      activo: i === 0,
    };
  });
}

function obtenerHorarioHoy() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const nombres = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  return infoNegocio.horarios.find((h) => h.dia === nombres[dia]) ?? infoNegocio.horarios[1];
}

const horariosDemo = [
  { hora: "12:00", disponible: true },
  { hora: "13:00", disponible: true },
  { hora: "14:30", disponible: false },
  { hora: "19:00", disponible: true },
  { hora: "20:00", disponible: true },
  { hora: "21:00", disponible: false },
];

const testimonios = [
  {
    nombre: "Valentina G.",
    texto: "La mejor experiencia de reserva que he tenido. Super rapido y la confirmacion por WhatsApp es genial.",
    rating: 5,
  },
  {
    nombre: "Andres O.",
    texto: "Excelente cafe y el sistema de reservas es muy intuitivo. Siempre encuentro mesa disponible.",
    rating: 5,
  },
  {
    nombre: "Camila M.",
    texto: "Perfecto para reuniones de trabajo. Reservo la mesa grande y siempre esta lista cuando llego.",
    rating: 5,
  },
];

export default function Inicio() {
  const fechas = obtenerProximasFechas();
  const horarioHoy = obtenerHorarioHoy();
  const totalMesas = mesas.length;

  return (
    <div className="min-h-screen bg-[#FBF7F0] font-[family-name:var(--font-manrope)]">

      {/* ── NAVBAR MOBILE ─────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 glass border-b border-[#E8DFD3]/80 px-5 py-3.5 flex items-center justify-between animate-fade-down">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#2C1810] rounded-xl flex items-center justify-center shadow-lg shadow-[#2C1810]/20">
            <Coffee className="w-4 h-4 text-[#C9A962]" />
          </div>
          <span className="font-[family-name:var(--font-playfair)] text-[#2C1810] text-lg tracking-tight">
            Cafe Aroma
          </span>
        </div>
        <button className="w-9 h-9 bg-[#F5EFE6] rounded-xl flex items-center justify-center hover:bg-[#EBE3D8] transition-colors active:scale-95">
          <Bell className="w-4 h-4 text-[#8B7355]" />
        </button>
      </header>

      {/* ── NAVBAR DESKTOP ────────────────────────────── */}
      <nav className="hidden md:block sticky top-0 z-50 glass border-b border-[#E8DFD3]/60 animate-fade-down">
        <div className="max-w-7xl mx-auto px-14 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2C1810] rounded-xl flex items-center justify-center shadow-lg shadow-[#2C1810]/15">
              <Coffee className="w-5 h-5 text-[#C9A962]" />
            </div>
            <span className="font-[family-name:var(--font-playfair)] text-[#2C1810] text-[22px] tracking-[0.5px]">
              Cafe Aroma
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#8B7355]">
            <Link href="/" className="text-[#2C1810] font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#C9A962] after:rounded-full">Inicio</Link>
            <Link href="/reservas" className="hover:text-[#2C1810] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#C9A962] after:rounded-full hover:after:w-full after:transition-all">Reservas</Link>
            <a href="#nosotros" className="hover:text-[#2C1810] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#C9A962] after:rounded-full hover:after:w-full after:transition-all">Nosotros</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="px-5 py-2.5 text-[13px] font-medium text-[#8B7355] border border-[#E8DFD3] rounded-full hover:bg-[#F5EFE6] hover:border-[#D1C7B8] transition-all">
              Iniciar sesion
            </Link>
            <Link
              href="/reservas"
              className="group px-6 py-2.5 text-[13px] font-semibold bg-[#C9A962] text-white rounded-full hover:bg-[#B8943F] transition-all shadow-md shadow-[#C9A962]/20 hover:shadow-lg hover:shadow-[#C9A962]/30 flex items-center gap-1.5"
            >
              Reservar ahora
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">

        {/* ── HERO ──────────────────────────────────────── */}
        <section className="px-5 md:px-14 pt-4 pb-5 md:pt-16 md:pb-20">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">

            {/* Texto hero (desktop) */}
            <div className="md:order-1">
              <div className="hidden md:inline-flex items-center gap-1.5 bg-[#C9A962]/10 text-[#C9A962] text-[11px] font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-[#C9A962]/20 animate-fade-up">
                <Zap className="w-3 h-3" />
                Reservas en linea · Confirmacion inmediata
              </div>

              <h1 className="hidden md:block font-[family-name:var(--font-playfair)] text-5xl font-normal text-[#2C1810] leading-[1.1] tracking-tight mb-5 animate-fade-up delay-100">
                El lugar perfecto<br />para cada momento
              </h1>
              <p className="hidden md:block text-base text-[#8B7355] mb-8 leading-relaxed max-w-[440px] animate-fade-up delay-200">
                Reserva tu mesa en segundos. Sin esperas, sin llamadas.
                Te confirmamos por WhatsApp al instante.
              </p>

              {/* Trust bar */}
              <div className="hidden md:flex items-center gap-4 mb-8 animate-fade-up delay-300">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-[#C9A962] text-[#C9A962]" />
                  ))}
                </div>
                <span className="text-[13px] font-medium text-[#8B7355]">4.9 · 200+ resenas</span>
                <div className="w-px h-4 bg-[#E8DFD3]" />
                <span className="text-[13px] font-medium text-[#8B7355]">500+ reservas</span>
              </div>

              <div className="hidden md:flex items-center gap-4 animate-fade-up delay-400">
                <Link
                  href="/reservas"
                  className="group px-7 py-3.5 bg-[#C9A962] text-white font-semibold rounded-full hover:bg-[#B8943F] transition-all flex items-center gap-2 shadow-lg shadow-[#C9A962]/20 hover:shadow-xl hover:shadow-[#C9A962]/30 active:scale-[0.98]"
                >
                  Reservar mesa
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#disponibilidad"
                  className="px-7 py-3.5 border border-[#E8DFD3] text-[#8B7355] font-medium rounded-full hover:bg-[#F5EFE6] hover:border-[#D1C7B8] transition-all"
                >
                  Ver disponibilidad
                </a>
              </div>
            </div>

            {/* Tarjeta hero visual */}
            <div className="md:order-2 animate-fade-up delay-100 md:delay-300">
              <div
                className="relative overflow-hidden rounded-[24px] min-h-[280px] md:min-h-[440px] flex flex-col justify-end p-6 md:p-8 texture-grain"
                style={{
                  background:
                    "radial-gradient(ellipse at 25% 30%, rgba(201,169,98,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(201,169,98,0.15) 0%, transparent 45%), linear-gradient(160deg, #3D2A1E 0%, #2C1810 50%, #1A0E08 100%)",
                }}
              >
                {/* Decorative circles */}
                <div className="absolute top-8 right-12 w-[100px] h-[100px] rounded-full border border-[#C9A962]/15 animate-float" />
                <div className="absolute top-12 right-16 w-[60px] h-[60px] rounded-full border border-[#C9A962]/10" />
                <div className="absolute bottom-24 left-8 w-3 h-3 rounded-full bg-[#C9A962]/20" />
                <div className="absolute top-20 left-12 w-2 h-2 rounded-full bg-[#C9A962]/25" />
                <div className="absolute bottom-32 right-20 w-2 h-2 rounded-full bg-[#C9A962]/15" />

                {/* Coffee icon */}
                <div className="absolute top-6 right-6 w-[56px] h-[56px] bg-[#C9A962]/15 rounded-2xl flex items-center justify-center border border-[#C9A962]/20 backdrop-blur-sm animate-pulse-gold">
                  <Coffee className="w-7 h-7 text-[#C9A962]" />
                </div>

                {/* Rating pill */}
                <div className="absolute top-6 left-6 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-1.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-[#C9A962] text-[#C9A962]" />
                  ))}
                  <span className="text-white text-xs font-semibold ml-1">4.9</span>
                </div>

                <div className="relative z-10">
                  <p className="text-[#C9A962] text-xs font-medium mb-3 md:hidden">Bienvenido a Cafe Aroma</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-white text-[28px] md:text-4xl font-normal leading-tight mb-4">
                    Reserva tu<br />
                    <span className="text-[#C9A962]">mesa perfecta</span>
                  </h2>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 bg-[#22C55E]/15 text-[#4ADE80] text-xs font-medium px-3 py-1.5 rounded-full border border-[#22C55E]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                      {horarioHoy?.cerrado
                        ? "Cerrado hoy"
                        : `Abierto · Cierra ${horarioHoy?.cierre}`}
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                      <Users className="w-3 h-3" />
                      {totalMesas} mesas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────── */}
        <section className="px-5 md:px-14 mb-7">
          <div className="grid grid-cols-3 gap-2.5 md:gap-4">
            {[
              { icon: Users, valor: totalMesas.toString(), etiqueta: "MESAS", destacado: true },
              { icon: MapPin, valor: totalMesasTerraza.toString(), etiqueta: "TERRAZA", destacado: false },
              { icon: Coffee, valor: totalMesasInterior.toString(), etiqueta: "INTERIOR", destacado: false },
            ].map(({ icon: Icon, valor, etiqueta, destacado }, i) => (
              <div
                key={etiqueta}
                className={`bg-white rounded-2xl p-4 border border-[#E8DFD3]/60 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div className={`w-8 h-8 ${destacado ? "bg-[#C9A962]/15" : "bg-[#F5EFE6]"} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-4 h-4 ${destacado ? "text-[#C9A962]" : "text-[#8B7355]"}`} />
                </div>
                <div className={`font-[family-name:var(--font-playfair)] text-[22px] ${destacado ? "text-[#C9A962]" : "text-[#2C1810]"}`}>{valor}</div>
                <div className="text-[9px] text-[#A99F91] font-semibold uppercase tracking-[1px] mt-0.5">{etiqueta}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DISPONIBILIDAD ───────────────────────────── */}
        <section id="disponibilidad" className="px-5 md:px-14 mb-7">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#2C1810] md:text-xl">
              Cuando visitaras?
            </h2>
            <Link href="/reservas" className="text-xs font-semibold text-[#C9A962] flex items-center gap-1 hover:gap-1.5 transition-all group">
              Ver todas
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Chips de fecha */}
          <div className="relative mb-5">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 scrollbar-none">
              {fechas.map((f, i) => (
                <Link
                  key={i}
                  href="/reservas"
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                    f.activo
                      ? "bg-[#2C1810] text-white font-semibold shadow-md shadow-[#2C1810]/15"
                      : "bg-white text-[#8B7355] border border-[#E8DFD3] hover:border-[#C9A962]/30 hover:text-[#2C1810] hover:shadow-sm"
                  }`}
                >
                  {f.etiqueta}
                </Link>
              ))}
            </div>
            <div className="md:hidden absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[#FBF7F0] to-transparent pointer-events-none" />
          </div>

          {/* Grid de horarios */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-3">
            {horariosDemo.map((slot) =>
              slot.disponible ? (
                <Link
                  key={slot.hora}
                  href="/reservas"
                  className="relative p-3.5 rounded-xl border text-center transition-all overflow-hidden bg-white border-[#E8DFD3]/60 hover:border-[#C9A962]/40 hover:shadow-md cursor-pointer group active:scale-[0.97]"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/0 to-[#C9A962]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-[15px] font-semibold text-[#2C1810]">{slot.hora}</div>
                  <div className="relative text-[10px] font-semibold mt-0.5 text-[#22C55E]">Disponible</div>
                </Link>
              ) : (
                <div
                  key={slot.hora}
                  className="relative p-3.5 rounded-xl border text-center transition-all overflow-hidden bg-[#F5EFE6]/50 border-[#E8DFD3]/30 opacity-45 cursor-not-allowed"
                >
                  <div className="text-[15px] font-semibold text-[#A99F91]">{slot.hora}</div>
                  <div className="text-[10px] font-semibold mt-0.5 text-[#A99F91]">Lleno</div>
                </div>
              )
            )}
          </div>
        </section>

        {/* ── CTA PRINCIPAL MOBILE ──────────────────────── */}
        <section className="px-5 md:px-14 mb-6 md:mb-0">
          <Link
            href="/reservas"
            className="group flex items-center justify-center gap-2 w-full py-4 bg-[#C9A962] text-white font-semibold text-[15px] rounded-2xl hover:bg-[#B8943F] transition-all active:scale-[0.98] shadow-lg shadow-[#C9A962]/20 hover:shadow-xl hover:shadow-[#C9A962]/30"
          >
            Reservar mesa
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-center text-[11px] text-[#A99F91] font-medium mt-3 md:hidden">
            Confirmacion inmediata · Sin llamadas · Gratis
          </p>
        </section>

        {/* ── TESTIMONIOS MOBILE ─────────────────────── */}
        <section className="md:hidden px-5 mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#2C1810]">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-none">
            {testimonios.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] bg-white rounded-2xl border border-[#E8DFD3]/60 p-4 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-2.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-3 h-3 fill-[#C9A962] text-[#C9A962]" />
                  ))}
                </div>
                <p className="text-[13px] text-[#8B7355] leading-relaxed mb-3">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#C9A962]/15 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-[#C9A962]" />
                  </div>
                  <span className="text-xs font-semibold text-[#2C1810]">{t.nombre}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS (desktop) ───────────────────── */}
        <section className="hidden md:block px-14 py-16 mt-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 bg-[#C9A962]/10 text-[#C9A962] text-[11px] font-semibold px-3.5 py-1.5 rounded-full mb-4 border border-[#C9A962]/20">
              <Sparkles className="w-3 h-3" />
              Proceso simple
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#2C1810]">
              Reserva en 3 pasos simples
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-5 relative">
            <div className="absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-[#E8DFD3] via-[#C9A962]/30 to-[#E8DFD3]" />

            {[
              {
                num: "01",
                icon: CalendarDays,
                titulo: "Elige tu fecha",
                desc: "Selecciona el dia y horario que mejor te convenga desde cualquier dispositivo.",
              },
              {
                num: "02",
                icon: MapPin,
                titulo: "Selecciona tu mesa",
                desc: "Visualiza las mesas disponibles con iconos interactivos. Interior o terraza.",
              },
              {
                num: "03",
                icon: CheckCircle2,
                titulo: "Confirma al instante",
                desc: "Recibe la confirmacion por WhatsApp. Sin esperas ni llamadas.",
              },
            ].map(({ num, icon: Icon, titulo, desc }) => (
              <div
                key={titulo}
                className="bg-white rounded-2xl p-7 border border-[#E8DFD3]/60 overflow-hidden relative group hover:shadow-lg hover:border-[#C9A962]/20 transition-all shadow-sm hover:-translate-y-1"
              >
                <div className="text-[#C9A962]/20 font-[family-name:var(--font-playfair)] text-5xl leading-none mb-4 select-none">{num}</div>
                <div className="w-12 h-12 bg-[#C9A962]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C9A962]/15 group-hover:scale-110 transition-all">
                  <Icon className="w-6 h-6 text-[#C9A962]" />
                </div>
                <h3 className="font-semibold text-[#2C1810] text-lg mb-2">{titulo}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIOS DESKTOP ────────────────────── */}
        <section className="hidden md:block px-14 py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 bg-[#C9A962]/10 text-[#C9A962] text-[11px] font-semibold px-3.5 py-1.5 rounded-full mb-4 border border-[#C9A962]/20">
              <Heart className="w-3 h-3" />
              +200 resenas
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#2C1810]">
              Nuestros clientes nos recomiendan
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-5 max-w-4xl mx-auto">
            {testimonios.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E8DFD3]/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative"
              >
                <Quote className="w-8 h-8 text-[#C9A962]/15 absolute top-5 right-5" />
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#C9A962] text-[#C9A962]" />
                  ))}
                </div>
                <p className="text-sm text-[#8B7355] leading-relaxed mb-4">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#C9A962]/15 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#C9A962]" />
                  </div>
                  <span className="text-sm font-semibold text-[#2C1810]">{t.nombre}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BENEFICIOS (desktop) ─────────────────────── */}
        <section className="hidden md:block px-14 py-12" id="nosotros">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#2C1810] text-center mb-10">
            Por que elegirnos?
          </h2>
          <div className="grid grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Star, titulo: "Calidad premium", desc: "Cafe de especialidad y reposteria artesanal de primera calidad." },
              { icon: Clock, titulo: "Reserva en 60 seg.", desc: "El proceso mas rapido del mercado. Sin formularios complicados." },
              { icon: Shield, titulo: "Cancelacion gratuita", desc: `Cancela hasta ${infoNegocio.politicaCancelacion.horasAnticipacion}h antes sin ningun costo.` },
              { icon: Users, titulo: "Grupos bienvenidos", desc: "Tenemos mesas para grupos de hasta 12 personas. Perfectas para celebraciones." },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-[#E8DFD3]/60 hover:shadow-md hover:border-[#C9A962]/15 hover:-translate-y-0.5 transition-all shadow-sm group">
                <div className="w-10 h-10 bg-[#C9A962]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A962]/15 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5 text-[#C9A962]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2C1810] mb-1">{titulo}</h3>
                  <p className="text-sm text-[#8B7355] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER (desktop) ─────────────────────────── */}
        <footer className="hidden md:block bg-[#2C1810] text-[#C4B9AC] mt-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A962]/30 to-transparent" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C9A962]/5 rounded-full blur-[120px] -translate-y-1/2" />

          <div className="max-w-7xl mx-auto px-14 py-12 relative">
            <div className="grid grid-cols-4 gap-8 mb-10">
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#C9A962]/15 rounded-xl flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-[#C9A962]" />
                  </div>
                  <span className="font-[family-name:var(--font-playfair)] text-white text-xl">Cafe Aroma</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs mb-4">
                  {infoNegocio.descripcion}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#C9A962] flex-shrink-0" />
                  <span>{infoNegocio.direccion}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Horarios</h4>
                <div className="space-y-1.5">
                  {infoNegocio.horarios.slice(0, 4).map((h) => (
                    <div key={h.dia} className="flex justify-between text-xs gap-4">
                      <span className="font-medium text-white/70">{h.dia.slice(0, 3)}</span>
                      <span>{h.cerrado ? "Cerrado" : `${h.apertura}-${h.cierre}`}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Contacto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C9A962]" />
                    <span>{infoNegocio.telefono}</span>
                  </div>
                  <p className="text-xs text-[#8B7355] mt-4">
                    {infoNegocio.redesSociales.instagram}
                  </p>
                </div>
                <Link
                  href="/reservas"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A962] text-white text-sm font-semibold rounded-full hover:bg-[#B8943F] transition-all shadow-md shadow-[#C9A962]/15 hover:shadow-lg"
                >
                  Reservar mesa
                </Link>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex items-center justify-between text-xs text-[#8B7355]">
              <span>2026 Cafe Aroma · Todos los derechos reservados</span>
              <span>Hecho con amor para nuestros clientes</span>
            </div>
          </div>
        </footer>

      </main>

      {/* ── BOTTOM NAV MOBILE ─────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-[#E8DFD3]/80 pb-safe z-50">
        <div className="flex justify-around py-2.5 max-w-lg mx-auto">
          {[
            { icon: Home, etiqueta: "Inicio", activo: true, href: "/" },
            { icon: CalendarDays, etiqueta: "Reservas", activo: false, href: "/reservas" },
            { icon: Search, etiqueta: "Buscar", activo: false, href: "#" },
            { icon: User, etiqueta: "Perfil", activo: false, href: "#" },
          ].map(({ icon: Icon, etiqueta, activo, href }) => (
            <Link key={etiqueta} href={href} className="flex flex-col items-center gap-1 px-3 py-1 relative active:scale-90 transition-transform">
              {activo && (
                <span className="absolute -top-2.5 w-5 h-0.5 bg-[#C9A962] rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${activo ? "text-[#C9A962]" : "text-[#A99F91]"}`}
                strokeWidth={activo ? 2.5 : 1.75}
              />
              <span className={`text-[10px] font-semibold transition-colors ${activo ? "text-[#C9A962]" : "text-[#A99F91]"}`}>
                {etiqueta}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="md:hidden h-24" />
    </div>
  );
}
