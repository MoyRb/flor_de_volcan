const entries = [
  ["06:15", "Ingreso de uva", "MP-104 · 1,200 kg"],
  ["09:45", "Inoculación", "Lote FDV-2604-A"],
  ["13:10", "Ajuste térmico", "Lote FDV-2604-B"],
];

export default function BitacoraPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Bitácora de vinificación</h1>
      <ol className="mt-4 space-y-3 border-l-2 border-fdv-border pl-4">
        {entries.map(([time, title, note]) => (
          <li key={time}>
            <p className="text-xs text-fdv-muted">{time}</p>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-fdv-muted">{note}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
