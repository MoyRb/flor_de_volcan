import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flor del Volcán | Sistema de Producción",
  description:
    "Panel administrativo y operativo para control de maquila y vinificación en Flor del Volcán.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
