export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Resumen operativo" },
  { href: "/catalogo", label: "Catálogo maestro", description: "Catálogos base" },
  { href: "/materia-prima", label: "Materia prima", description: "Entradas y stock" },
  { href: "/producto-terminado", label: "Producto terminado", description: "Inventario final" },
  { href: "/lotes", label: "Lotes", description: "Trazabilidad por lote" },
  { href: "/bitacora", label: "Bitácora", description: "Eventos diarios" },
  { href: "/parametros", label: "Parámetros", description: "Capturas y rangos" },
  { href: "/alertas", label: "Alertas", description: "Desviaciones" },
  { href: "/graficas", label: "Gráficas", description: "Vista diaria" },
  { href: "/clientes", label: "Clientes", description: "Cartera" },
  { href: "/creditos", label: "Créditos", description: "Saldo y pagos" },
  { href: "/ventas", label: "Historial de ventas", description: "Movimientos" },
  { href: "/pedidos", label: "Órdenes de pedido", description: "Pedidos activos" },
  { href: "/capacidad", label: "Capacidad", description: "Monitoreo de tanques" },
];
