"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { ImagenHero } from "@/lib/hero-config";

interface HeroCarouselProps {
  imagenes: ImagenHero[];
  intervalo?: number;
}

export function HeroCarousel({ imagenes, intervalo = 5000 }: HeroCarouselProps) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = imagenes.length;

  const avanzar = useCallback(() => {
    setIndice((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || pausado) return;
    timerRef.current = setTimeout(avanzar, intervalo);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [indice, total, intervalo, pausado, avanzar]);

  if (!imagenes.length) return null;

  return (
    <>
      {/* Imágenes en capas — crossfade */}
      {imagenes.map((img, i) => (
        <Image
          key={img.id}
          src={img.url}
          alt={`Café Orquídea Real — imagen ${i + 1}`}
          fill
          className={`object-cover object-center transition-opacity duration-1000 ${
            i === indice ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}

      {/* Dots — solo cuando hay más de 1 imagen */}
      {total > 1 && (
        <div
          className="absolute bottom-[4.5rem] md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
        >
          {imagenes.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a imagen ${i + 1}`}
              onClick={() => {
                setIndice(i);
                setPausado(true);
                // Reanuda auto-play tras 6s
                setTimeout(() => setPausado(false), 6000);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === indice
                  ? "w-5 h-1.5 bg-white shadow-md"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
