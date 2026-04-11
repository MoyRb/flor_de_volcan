const menuItems = [
  "Dashboard",
  "Lotes",
  "Bitácora",
  "Nueva medición",
  "Alertas",
  "Inventario",
  "Producto terminado",
  "Clientes",
  "Ventas / pedidos",
  "Configuración",
];

const kpis = [
  { label: "Lotes activos", value: "18", trend: "+2 esta semana", status: "ok" },
  { label: "Fermentación estable", value: "87%", trend: "Meta ≥ 85%", status: "ok" },
  { label: "Alertas críticas", value: "3", trend: "1 en seguimiento", status: "warn" },
  { label: "Producción mensual", value: "24,800 L", trend: "+9.2% vs marzo", status: "ok" },
];

const lotReadings = [
  { name: "Lote FDV-2404-A", stage: "Fermentación", brix: "21.4", ph: "3.46", temp: "18.5°C", volume: "3,200 L", status: "Estable" },
  { name: "Lote FDV-2404-B", stage: "Maceración", brix: "23.0", ph: "3.58", temp: "20.1°C", volume: "2,950 L", status: "Atención" },
  { name: "Lote FDV-2403-D", stage: "Clarificación", brix: "8.2", ph: "3.32", temp: "16.8°C", volume: "4,100 L", status: "Óptimo" },
];

const timeline = [
  { time: "06:45", title: "Ingreso de uva tempranillo", note: "Tolva 2 · 1,250 kg" },
  { time: "08:10", title: "Ajuste térmico automático", note: "Tanque 7 bajó a 18°C" },
  { time: "11:30", title: "Medición manual confirmada", note: "Lote FDV-2404-B con pH alto" },
  { time: "13:05", title: "Adición de levadura", note: "Lote FDV-2404-A" },
];

const alerts = [
  {
    level: "Crítica",
    title: "Temperatura fuera de rango",
    message: "Lote FDV-2404-B en 23.6°C (rango objetivo: 17-20°C)",
  },
  {
    level: "Advertencia",
    title: "Brix con descenso acelerado",
    message: "FDV-2404-A bajó 2.2 puntos en las últimas 8 horas",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-fdv-cream text-fdv-ink">
      <div className="grid min-h-screen lg:grid-cols-[272px_1fr]">
        <aside className="fdv-sidebar px-5 py-6">
          <div className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
            <p className="font-brand text-xl tracking-wide text-fdv-linen">Flor del Volcán</p>
            <p className="mt-1 text-xs text-fdv-linen/80">Maquiladora de vino · Operaciones</p>
          </div>

          <nav className="mt-6 space-y-1.5">
            {menuItems.map((item, index) => (
              <button
                key={item}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  index === 0
                    ? "bg-fdv-clay text-white shadow-sm"
                    : "text-fdv-linen/90 hover:bg-white/10"
                }`}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-fdv-linen/20 bg-white/5 p-4 text-xs text-fdv-linen/90">
            <p className="font-semibold">Turno actual</p>
            <p className="mt-1">Sábado · 11 de abril de 2026</p>
            <p className="mt-3">Operador: Andrea Morales</p>
          </div>
        </aside>

        <main className="relative overflow-hidden px-5 py-6 lg:px-8">
          <div className="fdv-watermark" aria-hidden />

          <header className="fdv-panel mb-5 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-fdv-muted">Dashboard general</p>
              <h1 className="font-brand text-3xl text-fdv-burgundy">Control de Producción</h1>
              <p className="text-sm text-fdv-muted">Vista ejecutiva y operativa de fermentación, calidad y flujo de lotes.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="fdv-btn-primary" type="button">Nueva medición</button>
              <button className="fdv-btn-secondary" type="button">Registrar evento</button>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <article key={kpi.label} className="fdv-panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-fdv-muted">{kpi.label}</p>
                <p className="mt-2 text-3xl font-semibold text-fdv-ink">{kpi.value}</p>
                <p className={`mt-2 text-sm ${kpi.status === "warn" ? "text-fdv-amber" : "text-fdv-olive"}`}>{kpi.trend}</p>
              </article>
            ))}
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <article className="fdv-panel p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-fdv-burgundy">Lotes activos y mediciones</h2>
                <div className="fdv-tabs">
                  <button className="fdv-tab-active" type="button">Hoy</button>
                  <button className="fdv-tab" type="button">7 días</button>
                  <button className="fdv-tab" type="button">30 días</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-fdv-muted">
                      <th className="pb-2 font-medium">Lote</th>
                      <th className="pb-2 font-medium">Etapa</th>
                      <th className="pb-2 font-medium">Brix</th>
                      <th className="pb-2 font-medium">pH</th>
                      <th className="pb-2 font-medium">Temp</th>
                      <th className="pb-2 font-medium">Volumen</th>
                      <th className="pb-2 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lotReadings.map((row) => (
                      <tr key={row.name} className="border-t border-fdv-border/70">
                        <td className="py-2.5 font-medium">{row.name}</td>
                        <td className="py-2.5">{row.stage}</td>
                        <td className="py-2.5">{row.brix}</td>
                        <td className="py-2.5">{row.ph}</td>
                        <td className="py-2.5">{row.temp}</td>
                        <td className="py-2.5">{row.volume}</td>
                        <td className="py-2.5">
                          <span
                            className={`fdv-badge ${
                              row.status === "Atención"
                                ? "fdv-badge-warn"
                                : row.status === "Estable"
                                  ? "fdv-badge-ok"
                                  : "fdv-badge-soft"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="fdv-widget">
                  <p className="text-xs uppercase tracking-[0.14em] text-fdv-muted">Fermentación por lote</p>
                  <div className="mt-3 space-y-2">
                    <div className="fdv-bar"><span style={{ width: "74%" }} />FDV-2404-A</div>
                    <div className="fdv-bar"><span style={{ width: "55%" }} />FDV-2404-B</div>
                    <div className="fdv-bar"><span style={{ width: "88%" }} />FDV-2403-D</div>
                  </div>
                </div>
                <div className="fdv-widget">
                  <p className="text-xs uppercase tracking-[0.14em] text-fdv-muted">Captura rápida de medición</p>
                  <form className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input className="fdv-input" placeholder="Lote" />
                    <input className="fdv-input" placeholder="Temp °C" />
                    <input className="fdv-input" placeholder="pH" />
                    <input className="fdv-input" placeholder="Brix" />
                    <button className="fdv-btn-primary sm:col-span-2" type="button">Guardar medición</button>
                  </form>
                </div>
              </div>
            </article>

            <div className="space-y-4">
              <article className="fdv-panel p-4">
                <h2 className="font-semibold text-fdv-burgundy">Alertas operativas</h2>
                <div className="mt-3 space-y-2.5">
                  {alerts.map((alert) => (
                    <div
                      key={alert.title}
                      className={`rounded-xl border p-3 ${
                        alert.level === "Crítica"
                          ? "border-fdv-error/40 bg-fdv-error/10"
                          : "border-fdv-amber/40 bg-fdv-amber/10"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em]">{alert.level}</p>
                      <p className="mt-1 text-sm font-semibold">{alert.title}</p>
                      <p className="mt-1 text-xs text-fdv-muted">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="fdv-panel p-4">
                <h2 className="font-semibold text-fdv-burgundy">Bitácora de vinificación</h2>
                <ol className="mt-3 space-y-3 border-l-2 border-fdv-border pl-4">
                  {timeline.map((event) => (
                    <li key={event.time} className="relative">
                      <span className="absolute -left-[1.44rem] top-1 h-2.5 w-2.5 rounded-full bg-fdv-clay" />
                      <p className="text-xs text-fdv-muted">{event.time}</p>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-fdv-muted">{event.note}</p>
                    </li>
                  ))}
                </ol>
              </article>

              <article className="fdv-panel p-4">
                <h2 className="font-semibold text-fdv-burgundy">Detalle de lote FDV-2404-B</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="fdv-stat"><span>Etapa</span><strong>Maceración</strong></div>
                  <div className="fdv-stat"><span>Volumen</span><strong>2,950 L</strong></div>
                  <div className="fdv-stat"><span>Temperatura</span><strong className="text-fdv-error">23.6°C</strong></div>
                  <div className="fdv-stat"><span>pH</span><strong>3.58</strong></div>
                  <div className="fdv-stat"><span>Brix</span><strong>23.0</strong></div>
                  <div className="fdv-stat"><span>Estado</span><strong className="text-fdv-amber">Requiere ajuste</strong></div>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
