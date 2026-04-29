import Link from 'next/link';

const items = [
  ['Frutas base', '/catalogo/frutas'],
  ['Recetas / tipos de vino', '/catalogo/tipos-vino'],
  ['Parámetros de control', '/catalogo/parametros-control'],
  ['Etapas de vinificación', '/catalogo/etapas-vinificacion'],
  ['Tipos de evento (bitácora)', '/bitacora'],
] as const;

export default function ConfiguracionPage() {
  return (
    <section className="fdv-panel p-6">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Configuración</h1>
      <p className="text-sm text-fdv-muted">Define parámetros base por fruta/receta (Brix, pH, temperatura, levadura, criterios y duración estimada) reutilizando catálogos existentes.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map(([label, href]) => <Link key={label} href={href} className="rounded-xl border border-fdv-border bg-white p-4 text-sm font-medium hover:bg-fdv-cream">{label}</Link>)}
      </div>
    </section>
  );
}
