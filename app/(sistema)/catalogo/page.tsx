import Link from 'next/link';

const catalogs = [
  { href: '/catalogo/frutas', title: 'Frutas', desc: 'Catálogo base (cat_material_types).' },
  { href: '/catalogo/tipos-vino', title: 'Tipos de vino', desc: 'Base comercial en finished_products.' },
  { href: '/catalogo/unidades', title: 'Unidades de medida', desc: 'Catálogo de unidades.' },
  { href: '/catalogo/parametros-control', title: 'Parámetros de control', desc: 'Rangos y alertas.' },
  { href: '/catalogo/etapas-vinificacion', title: 'Etapas de vinificación', desc: 'Flujo del lote.' },
  { href: '/catalogo/clientes', title: 'Clientes', desc: 'Catálogo comercial.' },
];

export default function CatalogoPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Catálogo maestro</h1>
      <p className="text-sm text-fdv-muted">Todos los catálogos se guardan en Supabase con CRUD real.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {catalogs.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border border-fdv-border bg-white p-3 transition hover:border-fdv-clay">
            <p className="font-semibold text-fdv-burgundy">{item.title}</p>
            <p className="mt-1 text-xs text-fdv-muted">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
