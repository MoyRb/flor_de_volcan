import { NuevoLoteForm } from './form';

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
      <NuevoLoteForm
        protocolos={protocolos}
        sistemasFermentacion={sistemasFermentacion}
        materiasPrimasBase={materiasPrimasBase}
        estadosLote={estadosLote}
        condicionesTransicion={condicionesTransicion}
        criteriosTransicion={criteriosTransicion}
      />
    </section>
  );
}
