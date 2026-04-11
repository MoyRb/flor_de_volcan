export default function ProductoTerminadoPage() {
  return (
    <section className="fdv-panel p-5">
      <h1 className="font-brand text-2xl text-fdv-burgundy">Producto terminado</h1>
      <p className="text-sm text-fdv-muted">Inventario disponible para venta y pedidos.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <article className="fdv-stat"><span>Vino tinto joven 750ml</span><strong>2,340 botellas</strong></article>
        <article className="fdv-stat"><span>Vino rosado 750ml</span><strong>1,180 botellas</strong></article>
        <article className="fdv-stat"><span>Vino blanco 750ml</span><strong>920 botellas</strong></article>
      </div>
    </section>
  );
}
