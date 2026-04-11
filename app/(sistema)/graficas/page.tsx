const points = [32, 41, 36, 48, 44, 57, 52];

export default function GraficasPage() {
  const maxValue = Math.max(...points);

  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Graficación diaria</h1>
      <p className="text-sm text-fdv-muted">Tendencia de litros procesados por día (últimos 7 días).</p>
      <div className="mt-5 grid grid-cols-7 items-end gap-2 rounded-xl border border-fdv-border bg-white p-4">
        {points.map((value, idx) => (
          <div key={`${value}-${idx}`} className="space-y-2 text-center">
            <div className="mx-auto w-full rounded-md bg-fdv-clay/25" style={{ height: `${(value / maxValue) * 180}px` }}>
              <div className="h-full w-full rounded-md bg-gradient-to-t from-fdv-clay to-fdv-wine" />
            </div>
            <p className="text-xs text-fdv-muted">D{idx + 1}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
