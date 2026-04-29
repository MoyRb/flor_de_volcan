import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";

export default async function LotesPage() {
  const supabase = await createClient();
  const { data: lots } = await supabase
    .from("wine_lots")
    .select("id, lot_code, start_date, current_volume_liters")
    .order("start_date", { ascending: false });

  return (
    <section className="fdv-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-brand text-2xl text-fdv-burgundy">Lotes</h1>
          <p className="text-sm text-fdv-muted">Vista limpia para seguimiento operativo del proceso.</p>
        </div>
        <Link href="/lotes/nuevo" className="fdv-btn-primary">Nuevo Lote</Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-fdv-border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-fdv-cream text-left text-fdv-muted">
            <tr><th className="px-3 py-2">Lote</th><th>Estado</th><th>Etapa</th><th>Volumen</th><th>Inicio</th><th>Última medición</th><th className="pr-3">Acción</th></tr>
          </thead>
          <tbody>
            {(lots ?? []).map((lot) => (
              <tr key={lot.id} className="border-t border-fdv-border">
                <td className="px-3 py-3 font-medium">{lot.lot_code}</td>
                <td>En seguimiento</td>
                <td>Fermentación</td>
                <td>{lot.current_volume_liters} L</td>
                <td>{lot.start_date}</td>
                <td>Hoy</td>
                <td className="pr-3"><button className="fdv-btn-secondary">Abrir detalle</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
