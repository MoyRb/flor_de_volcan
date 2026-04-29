export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Control de fermentación" },
  { href: "/lotes", label: "Lotes", description: "Seguimiento y detalle" },
  { href: "/lotes/nuevo", label: "Nuevo Lote", description: "Alta de proceso" },
  { href: "/mediciones", label: "Mediciones", description: "Registro de seguimiento" },
  { href: "/reportes", label: "Reportes", description: "Historial y consulta" },
  { href: "/configuracion", label: "Configuración", description: "Parámetros base" },
];
