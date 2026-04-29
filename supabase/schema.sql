-- Flor del Volcán - Esquema MVP (single-user, sin autenticación)
-- Compatible con Supabase/PostgreSQL

create extension if not exists pgcrypto;

-- =============================
-- Utilidades base
-- =============================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists audit_log (
  id bigserial primary key,
  table_name text not null,
  record_id uuid,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  changed_at timestamptz not null default now(),
  changed_data jsonb
);

create or replace function write_audit_log()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    insert into audit_log(table_name, record_id, action, changed_data)
    values (tg_table_name, old.id, tg_op, to_jsonb(old));
    return old;
  elsif tg_op = 'UPDATE' then
    insert into audit_log(table_name, record_id, action, changed_data)
    values (tg_table_name, new.id, tg_op, jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new)));
    return new;
  else
    insert into audit_log(table_name, record_id, action, changed_data)
    values (tg_table_name, new.id, tg_op, to_jsonb(new));
    return new;
  end if;
end;
$$;

-- =============================
-- Catálogos
-- =============================
create table if not exists cat_units (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_active boolean not null default true
);

create table if not exists cat_material_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_active boolean not null default true
);

create table if not exists cat_lot_status (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_closed boolean not null default false
);

create table if not exists cat_vinification_stages (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  stage_order integer not null unique,
  is_active boolean not null default true
);

create table if not exists cat_alert_severity (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  severity_order integer not null unique
);

create table if not exists cat_alert_status (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_closed boolean not null default false
);

create table if not exists cat_credit_status (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_closed boolean not null default false
);

create table if not exists cat_order_status (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  is_closed boolean not null default false
);

create table if not exists cat_tank_status (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  allows_assignment boolean not null default true
);

-- =============================
-- Maestros
-- =============================
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_code text unique not null,
  name text not null,
  phone text,
  email text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists raw_materials (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  material_type_id uuid not null references cat_material_types(id),
  base_unit_id uuid not null references cat_units(id),
  min_stock numeric(14,3) not null default 0 check (min_stock >= 0),
  current_stock numeric(14,3) not null default 0 check (current_stock >= 0),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists finished_products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  presentation text,
  base_unit_id uuid not null references cat_units(id),
  unit_volume_ml integer check (unit_volume_ml > 0),
  unit_cost numeric(14,2) not null default 0 check (unit_cost >= 0),
  sale_price numeric(14,2) not null default 0 check (sale_price >= 0),
  current_stock integer not null default 0 check (current_stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists process_parameters (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  unit_id uuid references cat_units(id),
  min_value numeric(14,4),
  max_value numeric(14,4),
  warning_low numeric(14,4),
  warning_high numeric(14,4),
  is_required boolean not null default false,
  is_active boolean not null default true,
  check (min_value is null or max_value is null or min_value <= max_value)
);

-- =============================
-- Lotes y vinificación
-- =============================
create table if not exists wine_lots (
  id uuid primary key default gen_random_uuid(),
  lot_code text unique not null,
  finished_product_id uuid references finished_products(id),
  lot_status_id uuid not null references cat_lot_status(id),
  current_stage_id uuid not null references cat_vinification_stages(id),
  start_date date not null,
  estimated_end_date date,
  actual_end_date date,
  target_volume_liters numeric(14,3) not null check (target_volume_liters > 0),
  current_volume_liters numeric(14,3) not null default 0 check (current_volume_liters >= 0),
  operational_state text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lot_stage_history (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  stage_id uuid not null references cat_vinification_stages(id),
  started_at timestamptz not null,
  ended_at timestamptz,
  comments text,
  unique (lot_id, stage_id, started_at)
);

create table if not exists lot_material_usage (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  raw_material_id uuid not null references raw_materials(id),
  quantity numeric(14,3) not null check (quantity > 0),
  usage_date timestamptz not null default now(),
  notes text
);

create table if not exists lot_parameter_readings (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  parameter_id uuid not null references process_parameters(id),
  reading_at timestamptz not null default now(),
  value numeric(14,4) not null,
  is_out_of_range boolean not null default false,
  notes text
);

create table if not exists lot_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  metric_date date not null,
  temperature_c numeric(8,3),
  ph numeric(8,3),
  brix numeric(8,3),
  alcohol_pct numeric(8,3),
  volume_liters numeric(14,3),
  observations text,
  unique (lot_id, metric_date)
);

-- =============================
-- Inventario y capacidad
-- =============================
create table if not exists raw_material_stock_movements (
  id uuid primary key default gen_random_uuid(),
  raw_material_id uuid not null references raw_materials(id),
  movement_type text not null check (movement_type in ('IN', 'OUT', 'ADJUSTMENT')),
  quantity numeric(14,3) not null check (quantity > 0),
  movement_date timestamptz not null default now(),
  unit_cost numeric(14,2),
  supplier_id uuid references suppliers(id),
  lot_id uuid references wine_lots(id) on delete set null,
  reference text,
  notes text
);

create table if not exists finished_product_stock_movements (
  id uuid primary key default gen_random_uuid(),
  finished_product_id uuid references finished_products(id),
  movement_type text not null check (movement_type in ('IN', 'OUT', 'ADJUSTMENT')),
  quantity integer not null check (quantity > 0),
  movement_date timestamptz not null default now(),
  lot_id uuid references wine_lots(id) on delete set null,
  reference text,
  notes text
);

create table if not exists capacity_tanks (
  id uuid primary key default gen_random_uuid(),
  tank_code text unique not null,
  name text not null,
  max_liters numeric(14,3) not null check (max_liters > 0),
  current_liters numeric(14,3) not null default 0 check (current_liters >= 0),
  tank_status_id uuid not null references cat_tank_status(id),
  current_lot_id uuid references wine_lots(id) on delete set null,
  last_measured_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tank_monitoring_logs (
  id uuid primary key default gen_random_uuid(),
  tank_id uuid not null references capacity_tanks(id) on delete cascade,
  measured_at timestamptz not null default now(),
  liters numeric(14,3) not null check (liters >= 0),
  temperature_c numeric(8,3),
  pressure_bar numeric(8,3),
  notes text
);

-- =============================
-- Alertas, bitácora y dashboard
-- =============================
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references wine_lots(id) on delete set null,
  tank_id uuid references capacity_tanks(id) on delete set null,
  reading_id uuid references lot_parameter_readings(id) on delete set null,
  severity_id uuid not null references cat_alert_severity(id),
  status_id uuid not null references cat_alert_status(id),
  title text not null,
  message text not null,
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_notes text
);

create table if not exists bitacora_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null,
  entry_date timestamptz not null default now(),
  lot_id uuid references wine_lots(id) on delete set null,
  tank_id uuid references capacity_tanks(id) on delete set null,
  details text not null,
  tags text[] not null default '{}'
);

create table if not exists dashboard_daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null unique,
  active_lots integer not null default 0,
  in_process_liters numeric(14,3) not null default 0,
  finished_units integer not null default 0,
  open_alerts integer not null default 0,
  overdue_credits integer not null default 0,
  pending_orders integer not null default 0,
  occupancy_pct numeric(8,3),
  notes text,
  created_at timestamptz not null default now()
);

-- =============================
-- Clientes, créditos, pedidos y ventas
-- =============================
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  client_code text unique not null,
  legal_name text not null,
  commercial_name text,
  tax_id text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  credit_limit numeric(14,2) not null default 0 check (credit_limit >= 0),
  current_balance numeric(14,2) not null default 0 check (current_balance >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists credit_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  credit_status_id uuid not null references cat_credit_status(id),
  opened_at date not null,
  due_date date,
  original_amount numeric(14,2) not null check (original_amount > 0),
  outstanding_amount numeric(14,2) not null check (outstanding_amount >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists credit_movements (
  id uuid primary key default gen_random_uuid(),
  credit_account_id uuid not null references credit_accounts(id) on delete cascade,
  movement_type text not null check (movement_type in ('CHARGE', 'PAYMENT', 'ADJUSTMENT')),
  movement_date timestamptz not null default now(),
  amount numeric(14,2) not null check (amount > 0),
  reference text,
  notes text
);

create table if not exists sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  client_id uuid not null references clients(id),
  order_status_id uuid not null references cat_order_status(id),
  order_date date not null,
  delivery_date date,
  subtotal numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sales_order_items (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references sales_orders(id) on delete cascade,
  finished_product_id uuid references finished_products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  line_total numeric(14,2) generated always as (quantity * unit_price) stored
);

create table if not exists sales_history (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null,
  sales_order_id uuid references sales_orders(id) on delete set null,
  client_id uuid not null references clients(id),
  finished_product_id uuid references finished_products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  total_amount numeric(14,2) generated always as (quantity * unit_price) stored,
  credit_account_id uuid references credit_accounts(id) on delete set null
);

-- =============================
-- Índices
-- =============================
create index if not exists idx_lot_parameter_readings_lot_date on lot_parameter_readings(lot_id, reading_at desc);
create index if not exists idx_lot_daily_metrics_lot_date on lot_daily_metrics(lot_id, metric_date desc);
create index if not exists idx_alerts_status_triggered on alerts(status_id, triggered_at desc);
create index if not exists idx_bitacora_entry_date on bitacora_entries(entry_date desc);
create index if not exists idx_sales_orders_date on sales_orders(order_date desc);
create index if not exists idx_sales_history_date on sales_history(sale_date desc);
create index if not exists idx_credit_accounts_client on credit_accounts(client_id, opened_at desc);
create index if not exists idx_raw_material_movements_date on raw_material_stock_movements(raw_material_id, movement_date desc);
create index if not exists idx_finished_product_movements_date on finished_product_stock_movements(finished_product_id, movement_date desc);
create index if not exists idx_tank_monitoring_date on tank_monitoring_logs(tank_id, measured_at desc);

-- =============================
-- Triggers de updated_at
-- =============================
create trigger trg_suppliers_updated_at
before update on suppliers
for each row execute function set_updated_at();

create trigger trg_raw_materials_updated_at
before update on raw_materials
for each row execute function set_updated_at();

create trigger trg_finished_products_updated_at
before update on finished_products
for each row execute function set_updated_at();

create trigger trg_wine_lots_updated_at
before update on wine_lots
for each row execute function set_updated_at();

create trigger trg_capacity_tanks_updated_at
before update on capacity_tanks
for each row execute function set_updated_at();

create trigger trg_clients_updated_at
before update on clients
for each row execute function set_updated_at();

create trigger trg_credit_accounts_updated_at
before update on credit_accounts
for each row execute function set_updated_at();

create trigger trg_sales_orders_updated_at
before update on sales_orders
for each row execute function set_updated_at();

-- =============================
-- Triggers de auditoría básica
-- =============================
create trigger trg_audit_raw_materials
after insert or update or delete on raw_materials
for each row execute function write_audit_log();

create trigger trg_audit_finished_products
after insert or update or delete on finished_products
for each row execute function write_audit_log();

create trigger trg_audit_wine_lots
after insert or update or delete on wine_lots
for each row execute function write_audit_log();

create trigger trg_audit_lot_parameter_readings
after insert or update or delete on lot_parameter_readings
for each row execute function write_audit_log();

create trigger trg_audit_alerts
after insert or update or delete on alerts
for each row execute function write_audit_log();

create trigger trg_audit_clients
after insert or update or delete on clients
for each row execute function write_audit_log();

create trigger trg_audit_credit_accounts
after insert or update or delete on credit_accounts
for each row execute function write_audit_log();

create trigger trg_audit_sales_orders
after insert or update or delete on sales_orders
for each row execute function write_audit_log();

create trigger trg_audit_sales_history
after insert or update or delete on sales_history
for each row execute function write_audit_log();

create trigger trg_audit_capacity_tanks
after insert or update or delete on capacity_tanks
for each row execute function write_audit_log();

-- =============================
-- Semillas mínimas de catálogos
-- =============================
insert into cat_units(code, name)
values
  ('KG', 'Kilogramo'),
  ('G', 'Gramo'),
  ('L', 'Litro'),
  ('ML', 'Mililitro'),
  ('BOT', 'Botella'),
  ('PZA', 'Pieza')
on conflict (code) do nothing;

insert into cat_material_types(code, name)
values
  ('UVA', 'Uva'),
  ('LEVADURA', 'Levadura'),
  ('ADITIVO', 'Aditivo'),
  ('EMPAQUE', 'Empaque')
on conflict (code) do nothing;

insert into cat_lot_status(code, name, is_closed)
values
  ('PLANNED', 'Planeado', false),
  ('ACTIVE', 'Activo', false),
  ('ON_HOLD', 'En pausa', false),
  ('FINISHED', 'Finalizado', true),
  ('CANCELLED', 'Cancelado', true)
on conflict (code) do nothing;

insert into cat_vinification_stages(code, name, stage_order)
values
  ('RECEPTION', 'Recepción y selección', 1),
  ('CRUSHING', 'Estrujado', 2),
  ('FERMENTATION', 'Fermentación', 3),
  ('RACKING', 'Trasiego', 4),
  ('AGING', 'Crianza', 5),
  ('STABILIZATION', 'Estabilización', 6),
  ('BOTTLING', 'Embotellado', 7),
  ('READY', 'Listo para venta', 8)
on conflict (code) do nothing;

insert into cat_alert_severity(code, name, severity_order)
values
  ('INFO', 'Informativa', 1),
  ('WARNING', 'Advertencia', 2),
  ('CRITICAL', 'Crítica', 3)
on conflict (code) do nothing;

insert into cat_alert_status(code, name, is_closed)
values
  ('OPEN', 'Abierta', false),
  ('ACK', 'Reconocida', false),
  ('RESOLVED', 'Resuelta', true)
on conflict (code) do nothing;

insert into cat_credit_status(code, name, is_closed)
values
  ('OPEN', 'Abierto', false),
  ('PARTIAL', 'Parcial', false),
  ('PAID', 'Pagado', true),
  ('OVERDUE', 'Vencido', false),
  ('CANCELLED', 'Cancelado', true)
on conflict (code) do nothing;

insert into cat_order_status(code, name, is_closed)
values
  ('DRAFT', 'Borrador', false),
  ('CONFIRMED', 'Confirmado', false),
  ('DELIVERED', 'Entregado', true),
  ('CANCELLED', 'Cancelado', true)
on conflict (code) do nothing;

insert into cat_tank_status(code, name, allows_assignment)
values
  ('AVAILABLE', 'Disponible', true),
  ('IN_USE', 'En uso', false),
  ('CLEANING', 'Limpieza', false),
  ('MAINTENANCE', 'Mantenimiento', false)
on conflict (code) do nothing;
