import { createClient } from '@/src/lib/supabase/server';
import { createLot } from './actions';

export default async function NuevoLotePage() {
  const supabase = await createClient();
  const [{ data: stages }, { data: tanks }, { data: fruits }, { data: recipes }] = await Promise.all([
    supabase.from('cat_vinification_stages').select('id,name').eq('is_active', true).order('stage_order'),
    supabase.from('capacity_tanks').select('id,name').order('name'),
    supabase.from('cat_material_types').select('id,name').eq('is_active', true).order('name'),
    supabase.from('finished_products').select('id,name').eq('is_active', true).order('name'),
  ]);

  return (
    <section className="fdv-panel max-w-4xl p-6">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Nuevo Lote</h1>
      <form action={createLot} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input name="lot_code" required placeholder="Código de lote" className="fdv-input" />
        <select name="fruit_id" required className="fdv-input"><option value="">Fruta</option>{(fruits ?? []).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
        <select name="recipe_id" className="fdv-input"><option value="">Ensayo / receta</option>{(recipes ?? []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
        <input type="number" step="0.01" name="liters" required placeholder="Volumen en litros" className="fdv-input" />
        <input type="date" name="start_date" required className="fdv-input" />
        <select name="stage_id" required className="fdv-input"><option value="">Etapa inicial</option>{(stages ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select name="tank_id" className="fdv-input"><option value="">Recipiente / tanque</option>{(tanks ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <input type="number" step="0.01" name="brix" required placeholder="Brix inicial" className="fdv-input" />
        <input type="number" step="0.01" name="ph" required placeholder="pH inicial" className="fdv-input" />
        <input type="number" step="0.1" name="temperature_c" placeholder="Temperatura inicial (opcional)" className="fdv-input" />
        <input name="yeast" placeholder="Levadura sugerida" className="fdv-input" />
        <input name="concentration" placeholder="Concentración (opcional)" className="fdv-input" />
        <input type="number" step="1" name="estimated_days" placeholder="Días estimados de etapa" className="fdv-input" />
        <input name="change_rule" placeholder="Regla de cambio de etapa" className="fdv-input" />
        <textarea name="notes" placeholder="Observaciones" className="fdv-input min-h-24 sm:col-span-2" />
        <div className="sm:col-span-2"><button className="fdv-btn-primary" type="submit">Crear lote</button></div>
      </form>
    </section>
  );
}
