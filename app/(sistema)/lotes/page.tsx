const lots = [
  ["FDV-2604-A", "Tempranillo", "Fermentación", "3,200 L", "En rango"],
  ["FDV-2604-B", "Rosado", "Maceración", "2,400 L", "Revisar temp"],
];

export default function LotesPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Lotes de vinificación</h1>
      <p className="text-sm text-fdv-muted">Trazabilidad integral desde materia prima hasta producto terminado.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-fdv-muted"><th>Lote</th><th>Producto</th><th>Etapa</th><th>Volumen</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {lots.map((row) => (
              <tr key={row[0]} className="border-t border-fdv-border">{row.map((col) => <td key={col} className="py-2">{col}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
