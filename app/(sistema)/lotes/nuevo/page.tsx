import { createLot } from './actions';

export default function NuevoLotePage() {
  return (
    <section className="fdv-panel max-w-3xl p-6">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Nuevo Lote</h1>
      <p className="text-sm text-fdv-muted">Registro inicial del lote para iniciar seguimiento de fermentación.</p>

      <form action={createLot} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span>Código de lote</span><input name="lot_code" required className="fdv-input w-full" /></label>
        <label className="space-y-1 text-sm"><span>Tipo de fruta/producto</span><input name="product_type" className="fdv-input w-full" /></label>
        <label className="space-y-1 text-sm"><span>Fecha de inicio</span><input type="date" name="start_date" required className="fdv-input w-full" /></label>
        <label className="space-y-1 text-sm"><span>Litros</span><input type="number" step="0.01" name="liters" required className="fdv-input w-full" /></label>
        <label className="space-y-1 text-sm"><span>Etapa inicial</span><input name="stage" className="fdv-input w-full" placeholder="Fermentación" /></label>
        <label className="space-y-1 text-sm"><span>Recipiente/Tanque</span><input name="tank" className="fdv-input w-full" /></label>
        <label className="space-y-1 text-sm sm:col-span-2"><span>Observaciones</span><textarea name="notes" className="fdv-input min-h-24 w-full" /></label>
        <div className="sm:col-span-2"><button className="fdv-btn-primary" type="submit">Crear lote</button></div>
      </form>
    </section>
  );
}
