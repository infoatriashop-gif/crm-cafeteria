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
  title: "Cafe Aroma · Reservas",
  description: "Reserva tu mesa en Cafe Aroma de forma rapida y sencilla. Confirmacion inmediata por WhatsApp.",
  keywords: ["cafeteria", "reservas", "bogota", "cafe aroma", "mesas"],
  openGraph: {
    title: "Cafe Aroma · Reserva tu mesa",
    description: "Reserva en segundos. Sin esperas, sin llamadas. Confirmacion por WhatsApp al instante.",
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
      <body className={`${dmSerif.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
