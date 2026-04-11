const catalogs = [
  "Variedades de uva",
  "Tipos de vino",
  "Unidades de medida",
  "Estados de lote",
  "Parámetros de control",
  "Tipos de cliente",
];

export default function CatalogoPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Catálogo maestro</h1>
      <p className="text-sm text-fdv-muted">Base de configuración para todo el sistema.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {catalogs.map((item) => (
          <div key={item} className="rounded-xl border border-fdv-border bg-white p-3 text-sm">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
