const kpis = [
  ["Lotes activos", "7"],
  ["Alertas abiertas", "3"],
  ["Capacidad ocupada", "72%"],
  ["Pedidos por surtir", "5"],
];

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <header className="fdv-panel p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-fdv-muted">Dashboard operativo</p>
        <h1 className="font-brand text-3xl text-fdv-burgundy">Flor del Volcán · MVP</h1>
        <p className="text-sm text-fdv-muted">Seguimiento diario de trazabilidad, producción e inventario.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <article key={label} className="fdv-panel p-4">
            <p className="text-xs uppercase text-fdv-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </div>

      <article className="fdv-panel p-4">
        <h2 className="font-semibold text-fdv-burgundy">Resumen de hoy</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-fdv-muted">
          <li>Lote FDV-2604-A en fermentación con parámetros en rango.</li>
          <li>Lote FDV-2604-B con alerta por temperatura superior a 20°C.</li>
          <li>Materia prima disponible para 2 nuevos lotes.</li>
        </ul>
      </article>
    </section>
  );
}
