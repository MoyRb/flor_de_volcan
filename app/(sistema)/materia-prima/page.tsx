const rows = [
  ["UVA-TEMPR", "Uva Tempranillo", "1,200 kg", "Lote MP-104"],
  ["LEV-001", "Levadura seca", "25 kg", "Lote MP-087"],
  ["BOT-750", "Botella 750ml", "4,500 pzas", "Lote MP-222"],
];

export default function MateriaPrimaPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Materia prima</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-fdv-muted">
              <th>Clave</th><th>Descripción</th><th>Existencia</th><th>Último ingreso</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-fdv-border">
                {row.map((col) => <td key={col} className="py-2">{col}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
