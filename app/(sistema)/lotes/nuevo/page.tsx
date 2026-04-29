import { createLot } from './actions';

export default async function NuevoLotePage() {
  const protocolos = ['Vinificación', 'Fermentación corta', 'Maceración', 'Infusión alcohólica', 'Carbonatación'];
  const sistemasFermentacion = ['PET 5L', 'PET 10L', 'Garrafón 20L', 'Vidrio', 'Acero inoxidable'];
  const materiasPrimasBase = ['Jamaica', 'Mango', 'Guanábana', 'Maracuyá', 'Café', 'Mixto'];
  const estadosLote = ['Preparación de mosto', 'Inoculación', 'Fermentación activa', 'Fermentación lenta', 'Post-fermentación', 'Ajuste de perfil', 'Estabilización', 'Envasado', 'Listo para venta'];
  const condicionesTransicion = ['Brix < 10°', 'pH estable', 'Ausencia de burbujeo'];
  const criteriosTransicion = ['Brix < 10', 'pH estable ±0.1', 'Día ≥ 7', 'Sin burbujeo visible'];

  return (
    <section className="fdv-panel max-w-4xl p-6">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Nuevo Lote</h1>
      <form action={createLot} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input name="lot_code" required placeholder="Código de lote" className="fdv-input" />
        <select name="base_material" required className="fdv-input"><option value="">Materia Prima Base</option>{materiasPrimasBase.map((m) => <option key={m} value={m}>{m}</option>)}</select>
        <select name="protocolo_proceso" required className="fdv-input"><option value="">Protocolo de proceso</option>{protocolos.map((p) => <option key={p} value={p}>{p}</option>)}</select>
        <input type="number" step="0.01" name="liters" required placeholder="Volumen en litros" className="fdv-input" />
        <input type="date" name="start_date" required className="fdv-input" />
        <select name="estado_lote" required className="fdv-input"><option value="">Estado del Lote</option>{estadosLote.map((e) => <option key={e} value={e}>{e}</option>)}</select>
        <select name="sistema_fermentacion" className="fdv-input"><option value="">Sistema de Fermentación</option>{sistemasFermentacion.map((sf) => <option key={sf} value={sf}>{sf}</option>)}</select>
        <input type="number" step="0.01" name="brix" required placeholder="Brix inicial" className="fdv-input" />
        <input type="number" step="0.01" name="ph" required placeholder="pH inicial" className="fdv-input" />
        <input type="number" step="0.1" name="temperature_c" placeholder="Temperatura de inoculación (opcional)" className="fdv-input" />
        <input name="inoculo_utilizado" placeholder="Inóculo utilizado" className="fdv-input" />
        <input type="number" step="0.01" name="inoculo_dosis_gl" placeholder="Dosis de inóculo (g/L)" className="fdv-input" />
        <input type="number" step="0.01" name="relacion_materia_prima_gl" placeholder="Relación materia prima/volumen (g/L)" className="fdv-input" />
        <select name="condicion_esperada_transicion" className="fdv-input"><option value="">Condición esperada de transición</option>{condicionesTransicion.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select name="criterio_transicion" className="fdv-input"><option value="">Criterio de transición</option>{criteriosTransicion.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <textarea name="notes" placeholder="Observaciones" className="fdv-input min-h-24 sm:col-span-2" />
        <div className="sm:col-span-2"><button className="fdv-btn-primary" type="submit">Crear lote</button></div>
      </form>
    </section>
  );
}
