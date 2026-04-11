const params = [
  ["Temperatura", "17-20 °C", "23.6 °C", "Fuera de rango"],
  ["pH", "3.2-3.6", "3.45", "En rango"],
  ["Brix", "20-24", "22.1", "En rango"],
];

export default function ParametrosPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Captura de parámetros</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-fdv-muted"><th>Parámetro</th><th>Rango objetivo</th><th>Lectura</th><th>Estatus</th></tr>
          </thead>
          <tbody>
            {params.map((row) => (
              <tr key={row[0]} className="border-t border-fdv-border">
                <td className="py-2">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td>
                <td className={row[3] === "Fuera de rango" ? "text-fdv-error" : "text-fdv-olive"}>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
