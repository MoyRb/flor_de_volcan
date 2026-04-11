# Flor del Volcán · Definición de MVP (sin login)

## Bloque 1: MVP exacto y arquitectura funcional

### Alcance MVP (1 operador)
- **Sin autenticación**, sin multiusuario, sin roles.
- Navegación principal por módulos operativos.
- Captura y consulta diaria de datos clave.
- Trazabilidad completa por lote.
- Alertas por desviación de parámetros.
- Historial operativo para auditoría interna.

### Arquitectura funcional
1. **Capa UI (Next.js App Router + Tailwind)**
   - Sidebar con módulos.
   - Vistas CRUD simples por módulo.
   - Dashboard con KPI + gráficas diarias.
2. **Capa de aplicación**
   - Validaciones de rangos de parámetros.
   - Reglas de negocio de estados de lote.
   - Generación automática de alertas.
3. **Capa de datos (Supabase / PostgreSQL)**
   - Tablas maestras (catálogos).
   - Tablas transaccionales (lotes, bitácora, parámetros, ventas, pedidos).
   - Vistas para métricas diarias.
4. **Preparado para futuro login**
   - Campo `created_by` nullable.
   - Patrón de servicios desacoplado de UI.

## Bloque 2: modelo de datos

### Núcleo de producción y trazabilidad
- `raw_materials`
- `raw_material_entries`
- `finished_products`
- `wine_lots`
- `lot_material_consumption`
- `vinification_steps`
- `lot_step_progress`
- `vinification_log`
- `parameter_definitions`
- `parameter_readings`
- `alerts`

### Comercial
- `clients`
- `credits`
- `sales_orders`
- `sales_order_items`
- `sales_history`

### Operación / monitoreo
- `production_capacity`
- `daily_snapshots`

### Relaciones clave
- Un `wine_lot` consume muchos `raw_materials`.
- Un `wine_lot` tiene múltiples `parameter_readings` y `vinification_log`.
- Las `alerts` nacen de `parameter_readings` fuera de rango.
- Un `client` tiene múltiples `credits`, `sales_orders` y `sales_history`.
- `production_capacity` + `wine_lots` construyen monitoreo diario.

## Bloque 4: estructura de rutas y carpetas (Next.js)

```txt
app/
  (sistema)/
    layout.tsx
    dashboard/page.tsx
    catalogo/page.tsx
    materia-prima/page.tsx
    producto-terminado/page.tsx
    lotes/page.tsx
    bitacora/page.tsx
    parametros/page.tsx
    alertas/page.tsx
    graficas/page.tsx
    clientes/page.tsx
    creditos/page.tsx
    ventas/page.tsx
    pedidos/page.tsx
    capacidad/page.tsx
  page.tsx (redirect a /dashboard)
components/
  sidebar.tsx
  navigation.ts
lib/
  supabase.ts
supabase/
  schema.sql
docs/
  mvp-plan.md
```
