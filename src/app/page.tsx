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
} from "lucide-react";
import { infoNegocio, totalMesasInterior, totalMesasTerraza, mesas } from "@/lib/datos-demo";

function obtenerProximasFechas() {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const hoy = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    return {
      etiqueta: i === 0 ? "Hoy" : i === 1 ? "Mañana" : `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`,
      activo: i === 0,
    };
  });
}

function obtenerHorarioHoy() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const nombres = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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

export default function Inicio() {
  const fechas = obtenerProximasFechas();
  const horarioHoy = obtenerHorarioHoy();
  const totalMesas = mesas.length;

  return (
    <div className="min-h-screen bg-[#0F0B08] font-sans">

      {/* ── NAVBAR MOBILE ─────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 bg-[#0F0B08]/95 backdrop-blur-md border-b border-white/6 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#C8852A]/20 rounded-xl flex items-center justify-center shadow-sm border border-[#C8852A]/25">
            <Coffee className="w-4.5 h-4.5 text-[#C8852A]" />
          </div>
          <span className="font-bold text-[#F0E6D3] text-lg tracking-tight">Café Aroma</span>
        </div>
        <button className="w-9 h-9 bg-[#1A1108] rounded-xl flex items-center justify-center shadow-sm border border-white/8">
          <Bell className="w-4 h-4 text-[#F0E6D3]/50" />
        </button>
      </header>

      {/* ── NAVBAR DESKTOP ────────────────────────────── */}
      <nav className="hidden md:block sticky top-0 z-50 bg-[#0F0B08]/95 backdrop-blur-md border-b border-white/6">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8852A]/20 rounded-xl flex items-center justify-center border border-[#C8852A]/25">
              <Coffee className="w-5 h-5 text-[#C8852A]" />
            </div>
            <span className="font-bold text-[#F0E6D3] text-xl tracking-tight">Café Aroma</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-[#F0E6D3]/55">
            <Link href="/" className="text-[#F0E6D3] font-semibold">Inicio</Link>
            <Link href="/reservas" className="hover:text-[#F0E6D3] transition-colors">Reservas</Link>
            <a href="#nosotros" className="hover:text-[#F0E6D3] transition-colors">Nosotros</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-[#F0E6D3]/70 border border-white/15 rounded-full hover:bg-white/6 transition-colors">
              Iniciar sesión
            </button>
            <Link
              href="/reservas"
              className="px-5 py-2 text-sm font-semibold bg-[#C8852A] text-white rounded-full hover:bg-[#b5741f] transition-colors shadow-sm"
            >
              Reservar ahora
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">

        {/* ── HERO ──────────────────────────────────────── */}
        <section className="px-5 md:px-8 pt-6 pb-5 md:pt-16 md:pb-20">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">

            {/* Texto hero */}
            <div className="md:order-1">
              <div className="hidden md:inline-flex items-center gap-2 bg-[#C8852A]/15 text-[#C8852A] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#C8852A]/25">
                <Zap className="w-3 h-3" />
                Reservas en línea
              </div>

              <h1 className="hidden md:block text-5xl font-extrabold text-[#F0E6D3] leading-tight mb-4">
                El lugar perfecto<br />para cada momento
              </h1>
              <p className="hidden md:block text-lg text-[#8A6650] mb-8">
                Reserva tu mesa en segundos. Sin esperas, sin llamadas.
              </p>

              <div className="hidden md:flex items-center gap-4 mb-8">
                <Link
                  href="/reservas"
                  className="px-7 py-3.5 bg-[#C8852A] text-white font-semibold rounded-full hover:bg-[#b5741f] transition-colors shadow-md"
                >
                  Reservar mesa
                </Link>
                <a
                  href="#disponibilidad"
                  className="px-7 py-3.5 border border-white/15 text-[#F0E6D3]/80 font-semibold rounded-full hover:bg-white/6 transition-colors"
                >
                  Ver disponibilidad
                </a>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {[
                  { icon: Star, texto: "4.9 · Excelente" },
                  { icon: Users, texto: "500+ reservas" },
                  { icon: Zap, texto: "Respuesta inmediata" },
                ].map(({ icon: Icon, texto }) => (
                  <div key={texto} className="flex items-center gap-2 text-sm text-[#8A6650]">
                    <Icon className="w-4 h-4 text-[#C8852A]" />
                    <span className="font-medium">{texto}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta hero visual */}
            <div className="md:order-2">
              <div
                className="relative overflow-hidden rounded-3xl min-h-[260px] md:min-h-[400px] flex flex-col justify-end p-6 md:p-8 shadow-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 25% 40%, rgba(200,133,42,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 15%, rgba(200,133,42,0.2) 0%, transparent 45%), linear-gradient(160deg, #080402 0%, #150b04 40%, #1e0e05 70%, #100701 100%)",
                }}
              >
                <div className="absolute top-10 left-16 w-28 h-28 rounded-full bg-[#C8852A]/25 blur-3xl" />
                <div className="absolute top-6 right-10 w-20 h-20 rounded-full bg-amber-400/15 blur-2xl" />
                <div className="absolute bottom-16 left-6 w-24 h-24 rounded-full bg-[#C8852A]/15 blur-3xl" />

                <div className="absolute top-6 right-6 w-12 h-12 bg-[#C8852A]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-[#C8852A]/30">
                  <Coffee className="w-6 h-6 text-[#C8852A]" />
                </div>

                <div className="relative z-10">
                  <p className="text-[#C8852A] text-sm font-semibold mb-1 md:hidden">Bienvenido</p>
                  <h2 className="text-white text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                    Reserva tu<br />mesa perfecta
                  </h2>
                  <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-500/25 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {horarioHoy?.cerrado
                      ? "Cerrado hoy"
                      : `Abierto ahora · Cierra ${horarioHoy?.cierre}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────── */}
        <section className="px-5 md:px-8 mb-7">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-[#1A1108] rounded-2xl p-4 border border-[#2E1E0E] text-center">
              <div className="text-2xl font-extrabold text-[#C8852A]">{totalMesas}</div>
              <div className="text-xs text-[#8A6650] font-medium mt-0.5">mesas totales</div>
            </div>
            <div className="bg-[#1A1108] rounded-2xl p-4 border border-[#2E1E0E] text-center">
              <div className="text-lg font-bold text-[#F0E6D3]">Terraza</div>
              <div className="text-xs text-[#8A6650] font-medium mt-0.5">{totalMesasTerraza} mesas</div>
            </div>
            <div className="bg-[#1A1108] rounded-2xl p-4 border border-[#2E1E0E] text-center">
              <div className="text-lg font-bold text-[#F0E6D3]">Interior</div>
              <div className="text-xs text-[#8A6650] font-medium mt-0.5">{totalMesasInterior} mesas</div>
            </div>
          </div>
        </section>

        {/* ── DISPONIBILIDAD ───────────────────────────── */}
        <section id="disponibilidad" className="px-5 md:px-8 mb-7">
          <h2 className="text-base font-semibold text-[#F0E6D3] mb-3 md:text-xl md:mb-5">
            ¿Cuándo visitarás?
          </h2>

          {/* Chips de fecha */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 scrollbar-none mb-5">
            {fechas.map((f, i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  f.activo
                    ? "bg-[#F0E6D3] text-[#0F0B08] shadow-md font-semibold"
                    : "bg-[#1A1108] text-[#F0E6D3]/55 border border-[#2E1E0E]"
                }`}
              >
                {f.etiqueta}
              </div>
            ))}
          </div>

          {/* Grid de horarios */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3">
            {horariosDemo.map((slot) => (
              <div
                key={slot.hora}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  slot.disponible
                    ? "bg-[#1A1108] border-[#2E1E0E] hover:border-[#C8852A]/40 cursor-pointer"
                    : "bg-white/3 border-transparent opacity-50"
                }`}
              >
                <div className={`text-base font-bold ${slot.disponible ? "text-[#F0E6D3]" : "text-[#F0E6D3]/25"}`}>
                  {slot.hora}
                </div>
                <div className={`text-xs font-semibold mt-0.5 ${slot.disponible ? "text-green-400" : "text-red-400/70"}`}>
                  {slot.disponible ? "Disponible" : "Lleno"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA PRINCIPAL ─────────────────────────────── */}
        <section className="px-5 md:px-8 mb-8 md:mb-0">
          <Link
            href="/reservas"
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#C8852A] text-white font-bold text-base rounded-full shadow-lg hover:bg-[#b5741f] transition-all active:scale-[0.98]"
          >
            Reservar mesa
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-center text-xs text-[#8A6650] mt-2.5 md:hidden">
            Confirmación inmediata · Sin llamadas
          </p>
        </section>

        {/* ── FEATURE CARDS (solo desktop) ─────────────── */}
        <section className="hidden md:block px-8 py-16 mt-8">
          <p className="text-xs font-semibold text-[#C8852A] text-center uppercase tracking-wider mb-2">
            Cómo funciona
          </p>
          <h2 className="text-3xl font-extrabold text-[#F0E6D3] text-center mb-10">
            Disponibilidad en tiempo real
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: CalendarDays,
                titulo: "Elige tu fecha",
                desc: "Selecciona el día y horario que mejor te convenga desde cualquier dispositivo.",
              },
              {
                icon: MapPin,
                titulo: "Selecciona tu mesa",
                desc: "Elige entre interior o terraza. Visualiza la disponibilidad al instante.",
              },
              {
                icon: CheckCircle2,
                titulo: "Confirma al instante",
                desc: "Recibe la confirmación por WhatsApp. Sin esperas ni llamadas.",
              },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div
                key={titulo}
                className="bg-[#1A1108] rounded-2xl p-7 border border-[#2E1E0E] overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C8852A] rounded-t-2xl" />
                <div className="w-12 h-12 bg-[#C8852A]/15 rounded-xl flex items-center justify-center mb-4 border border-[#C8852A]/20">
                  <Icon className="w-6 h-6 text-[#C8852A]" />
                </div>
                <h3 className="font-bold text-[#F0E6D3] text-lg mb-2">{titulo}</h3>
                <p className="text-[#8A6650] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BENEFICIOS (solo desktop) ─────────────────── */}
        <section className="hidden md:block px-8 py-12" id="nosotros">
          <h2 className="text-3xl font-extrabold text-[#F0E6D3] text-center mb-10">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { icon: Star, titulo: "Calidad premium", desc: "Café de especialidad y repostería artesanal de primera calidad." },
              { icon: Clock, titulo: "Reserva en 60 seg.", desc: "El proceso más rápido del mercado. Sin formularios complicados." },
              { icon: Shield, titulo: "Cancelación gratuita", desc: `Cancela hasta ${infoNegocio.politicaCancelacion.horasAnticipacion}h antes sin ningún costo.` },
              { icon: Users, titulo: "Grupos bienvenidos", desc: "Tenemos mesas para grupos de hasta 12 personas. Perfectas para celebraciones." },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="flex items-start gap-4 bg-[#1A1108] rounded-2xl p-6 border border-[#2E1E0E]">
                <div className="w-10 h-10 bg-[#C8852A]/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#C8852A]/20">
                  <Icon className="w-5 h-5 text-[#C8852A]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F0E6D3] mb-1">{titulo}</h3>
                  <p className="text-sm text-[#8A6650] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER (solo desktop) ─────────────────────── */}
        <footer className="hidden md:block bg-[#080402] text-[#F0E6D3]/55 mt-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-4 gap-8 mb-10">
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#C8852A]/20 rounded-xl flex items-center justify-center border border-[#C8852A]/25">
                    <Coffee className="w-5 h-5 text-[#C8852A]" />
                  </div>
                  <span className="font-bold text-[#F0E6D3] text-xl">Café Aroma</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs mb-4">
                  {infoNegocio.descripcion}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#C8852A] flex-shrink-0" />
                  <span>{infoNegocio.direccion}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#F0E6D3] mb-4">Horarios</h4>
                <div className="space-y-1.5">
                  {infoNegocio.horarios.slice(0, 4).map((h) => (
                    <div key={h.dia} className="flex justify-between text-xs gap-4">
                      <span className="font-medium text-[#F0E6D3]/70">{h.dia.slice(0, 3)}</span>
                      <span>{h.cerrado ? "Cerrado" : `${h.apertura}–${h.cierre}`}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#F0E6D3] mb-4">Contacto</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C8852A]" />
                    <span>{infoNegocio.telefono}</span>
                  </div>
                  <p className="text-xs text-[#F0E6D3]/35 mt-4">
                    {infoNegocio.redesSociales.instagram}
                  </p>
                </div>
                <Link
                  href="/reservas"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8852A] text-white text-sm font-semibold rounded-full hover:bg-[#b5741f] transition-colors"
                >
                  Reservar mesa
                </Link>
              </div>
            </div>
            <div className="border-t border-white/6 pt-6 flex items-center justify-between text-xs text-[#F0E6D3]/30">
              <span>© 2026 Café Aroma · Todos los derechos reservados</span>
              <span>Hecho con ♥ para nuestros clientes</span>
            </div>
          </div>
        </footer>

      </main>

      {/* ── BOTTOM NAV MOBILE ─────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1108] border-t border-[#2E1E0E] pb-safe z-50">
        <div className="flex justify-around py-2.5 max-w-lg mx-auto">
          {[
            { icon: Home, etiqueta: "Inicio", activo: true, href: "/" },
            { icon: CalendarDays, etiqueta: "Reservas", activo: false, href: "/reservas" },
            { icon: Search, etiqueta: "Buscar", activo: false, href: "#" },
            { icon: User, etiqueta: "Perfil", activo: false, href: "#" },
          ].map(({ icon: Icon, etiqueta, activo, href }) => (
            <Link key={etiqueta} href={href} className="flex flex-col items-center gap-1 px-3 py-1">
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

      <div className="md:hidden h-24" />
    </div>
  );
}
