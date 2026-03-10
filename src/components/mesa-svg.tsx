"use client";

import type { Mesa } from "@/tipos";
import { Check } from "lucide-react";

// ── Silla (rounded rect posicionada con transform) ────────────
function Silla({ x, y, rot, color }: { x: number; y: number; rot: number; color: string }) {
  return (
    <rect
      x={-6}
      y={-3.5}
      width={12}
      height={7}
      rx={2.5}
      ry={2.5}
      fill={color}
      transform={`translate(${x},${y}) rotate(${rot})`}
    />
  );
}

// ── Posiciones de sillas para mesa redonda ────────────────────
function sillasRedondas(cantidad: number, cx: number, cy: number, dist: number) {
  return Array.from({ length: cantidad }, (_, i) => {
    const ang = (360 / cantidad) * i - 90;
    const rad = (ang * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * dist, y: cy + Math.sin(rad) * dist, rot: ang + 90 };
  });
}

// ── Posiciones de sillas para mesa rectangular ────────────────
function sillasRectangulares(cantidad: number, cx: number, cy: number, ancho: number, alto: number) {
  const sillas: { x: number; y: number; rot: number }[] = [];
  const porLado = Math.floor((cantidad - 2) / 2);
  const esp = ancho / (porLado + 1);

  for (let i = 0; i < porLado; i++) {
    const x = cx - ancho / 2 + esp * (i + 1);
    sillas.push({ x, y: cy - alto / 2 - 10, rot: 0 });
    sillas.push({ x, y: cy + alto / 2 + 10, rot: 180 });
  }
  sillas.push({ x: cx - ancho / 2 - 10, y: cy, rot: 270 });
  sillas.push({ x: cx + ancho / 2 + 10, y: cy, rot: 90 });

  return sillas.slice(0, cantidad);
}

// ── Componente principal ──────────────────────────────────────
interface MesaSVGProps {
  mesa: Mesa;
  seleccionada: boolean;
  onClick?: () => void;
}

export function MesaSVG({ mesa, seleccionada, onClick }: MesaSVGProps) {
  const { capacidad, numero, disponible } = mesa;
  const esRedonda = capacidad <= 6;

  // Colores según estado
  const mesaColor = seleccionada ? "#8E6AA3" : disponible ? "#C4BAD4" : "#D9D0E3";
  const sillaColor = seleccionada ? "#7A5691" : disponible ? "#B0A0CB" : "#C4BAD4";
  const textoColor = seleccionada ? "#FFFFFF" : disponible ? "#4A3B5C" : "#9B8FB0";

  let vb: string;
  let sillas: { x: number; y: number; rot: number }[];
  let mesa_jsx: React.ReactNode;

  if (esRedonda) {
    const sz = capacidad <= 2 ? 70 : capacidad <= 4 ? 80 : 92;
    const c = sz / 2;
    const r = capacidad <= 2 ? 13 : capacidad <= 4 ? 15 : 17;
    vb = `0 0 ${sz} ${sz}`;
    sillas = sillasRedondas(capacidad, c, c, r + 13);
    mesa_jsx = (
      <>
        <circle cx={c} cy={c} r={r} fill={mesaColor} />
        <text x={c} y={c + 1} textAnchor="middle" dominantBaseline="central"
          fill={textoColor} fontSize="11" fontWeight="700">{numero}</text>
      </>
    );
  } else {
    const w = capacidad <= 8 ? 56 : 82;
    const h = 24;
    const svgW = w + 38;
    const svgH = h + 38;
    const cx = svgW / 2;
    const cy = svgH / 2;
    vb = `0 0 ${svgW} ${svgH}`;
    sillas = sillasRectangulares(capacidad, cx, cy, w, h);
    mesa_jsx = (
      <>
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={6} fill={mesaColor} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
          fill={textoColor} fontSize="11" fontWeight="700">{numero}</text>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={disponible ? onClick : undefined}
      disabled={!disponible}
      className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-300 w-full ${
        seleccionada
          ? "border-[#8E6AA3] bg-[#8E6AA3]/8 shadow-lg shadow-[#8E6AA3]/10"
          : disponible
          ? "border-transparent bg-white/60 hover:bg-white hover:shadow-md hover:border-[#8E6AA3]/20 cursor-pointer active:scale-[0.97]"
          : "border-transparent bg-[#F0EBE3]/60 opacity-50 cursor-not-allowed"
      }`}
    >
      <svg
        viewBox={vb}
        className={`${esRedonda ? "w-16 h-16 md:w-20 md:h-20" : "w-20 h-14 md:w-24 md:h-16"} transition-transform duration-300 group-hover:scale-105`}
      >
        {seleccionada && (
          <defs>
            <filter id={`glow-${numero}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}
        <g filter={seleccionada ? `url(#glow-${numero})` : undefined}>
          {sillas.map((s, i) => <Silla key={i} {...s} color={sillaColor} />)}
          {mesa_jsx}
        </g>
      </svg>

      <div className="text-center">
        <p className={`text-[11px] font-bold leading-tight ${
          seleccionada ? "text-[#8E6AA3]" : disponible ? "text-[#2C1810]" : "text-[#A99F91]"
        }`}>
          {capacidad} {capacidad === 1 ? "persona" : "personas"}
        </p>
      </div>

      {/* Badge de seleccion */}
      {seleccionada && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#8E6AA3] rounded-full flex items-center justify-center shadow-md">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}
