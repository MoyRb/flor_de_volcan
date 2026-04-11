const alerts = [
  { level: "Crítica", title: "Temperatura alta", detail: "FDV-2604-B: 23.6°C" },
  { level: "Advertencia", title: "Brix en descenso rápido", detail: "FDV-2604-A" },
];

export default function AlertasPage() {
  return (
    <section className="space-y-3">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Alertas</h1>
      {alerts.map((alert) => (
        <article
          key={alert.title}
          className={`fdv-panel p-4 ${alert.level === "Crítica" ? "border-fdv-error" : "border-fdv-amber"}`}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-fdv-muted">{alert.level}</p>
          <p className="text-lg font-semibold">{alert.title}</p>
          <p className="text-sm text-fdv-muted">{alert.detail}</p>
        </article>
      ))}
    </section>
  );
}
