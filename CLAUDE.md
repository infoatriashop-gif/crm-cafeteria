# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre el proyecto

Web app para que los clientes de una cafetería puedan ver disponibilidad y hacer reservas de mesas. El CRM social (atención al cliente, mensajes, seguimiento) se maneja con Pancake CRM vía API. Esta app solo maneja reservas y la integración con Pancake.

## Reglas generales

- Todo el código, comentarios y UI en español
- Nunca hardcodear credenciales o API keys, usar variables de entorno
- Siempre validar inputs del usuario
- Diseño mobile-first
- TypeScript siempre
- Commits en español con formato: `tipo(alcance): descripción`

## Stack tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Estilos**: Tailwind CSS + shadcn/ui
- **Validación**: Zod + react-hook-form
- **Lenguaje**: TypeScript (estricto)
- **Hosting**: Vercel (+ BD Postgres de Vercel)
- **CRM externo**: Pancake CRM (integración vía API, placeholder por ahora)

## Comandos de desarrollo

- `npm run dev` → Inicia servidor en `localhost:9817`
- `npm run build` → Build de producción
- `npm run lint` → Linter ESLint

## Estructura del proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Landing
│   ├── reservas/page.tsx   # Página de reservas
│   └── api/reservas/route.ts  # API de reservas
├── components/ui/          # Componentes shadcn/ui
├── lib/
│   ├── validaciones.ts     # Esquemas Zod
│   └── pancake.ts          # Cliente Pancake CRM (placeholder)
└── tipos/index.ts          # Tipos TypeScript
```
