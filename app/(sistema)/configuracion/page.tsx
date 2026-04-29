import Link from 'next/link';

const items = [
  ['Etapas de vinificación', '/catalogo/etapas-vinificacion'],
  ['Parámetros de control', '/catalogo/parametros-control'],
  ['Unidades', '/catalogo/unidades'],
  ['Tipos de evento', '/bitacora'],
  ['Estados de lote', '/catalogo'],
] as const;

export default function ConfiguracionPage() {
  return (
    <section className="fdv-panel p-6">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Configuración</h1>
      <p className="text-sm text-fdv-muted">Solo configuración mínima para el MVP operativo.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map(([label, href]) => (
          <Link key={label} href={href} className="rounded-xl border border-fdv-border bg-white p-4 text-sm font-medium hover:bg-fdv-cream">{label}</Link>
        ))}
      </div>
    </section>
  );
}
