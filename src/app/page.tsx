import Link from "next/link";

export default function Inicio() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex max-w-lg flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Bienvenido a nuestra Cafetería
        </h1>
        <p className="text-lg text-muted-foreground">
          Consulta la disponibilidad y reserva tu mesa de forma rápida y
          sencilla.
        </p>
        <Link
          href="/reservas"
          className="rounded-full bg-primary px-8 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Reservar mesa
        </Link>
      </main>
    </div>
  );
}
