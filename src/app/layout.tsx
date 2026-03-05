import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Café Aroma · Reservas",
  description: "Reserva tu mesa en Café Aroma de forma rápida y sencilla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSerif.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
