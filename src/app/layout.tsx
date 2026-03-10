import type { Metadata } from "next";
import { Dancing_Script, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Café Orquídea Real · Reservas",
  description: "Reserva tu mesa en Café Orquídea Real de forma rápida y sencilla. Saborea la calma, respira el instante.",
  keywords: ["cafeteria", "reservas", "cali", "cafe orquidea real", "mesas", "orquidea"],
  openGraph: {
    title: "Café Orquídea Real · Reserva tu mesa",
    description: "Reserva en segundos. Sin esperas, sin llamadas. Saborea la calma, respira el instante.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dancingScript.variable} ${sourceSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
