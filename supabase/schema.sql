-- Flor del Volcán MVP schema (single operator, no auth)
create extension if not exists pgcrypto;

create table if not exists raw_materials (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  unit text not null,
  minimum_stock numeric(12,2) default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists raw_material_entries (
  id uuid primary key default gen_random_uuid(),
  raw_material_id uuid not null references raw_materials(id),
  entry_date date not null,
  quantity numeric(12,2) not null,
  unit_cost numeric(12,2),
  supplier text,
  batch_reference text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists finished_products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  presentation text not null,
  available_units integer not null default 0,
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists wine_lots (
  id uuid primary key default gen_random_uuid(),
  lot_code text unique not null,
  product_name text not null,
  stage text not null,
  start_date date not null,
  estimated_end_date date,
  volume_liters numeric(12,2) not null,
  status text not null default 'active',
  observations text,
  created_at timestamptz not null default now()
);

create table if not exists lot_material_consumption (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  raw_material_id uuid not null references raw_materials(id),
  consumed_quantity numeric(12,2) not null,
  consumed_at timestamptz not null default now(),
  notes text
);

create table if not exists vinification_steps (
  id uuid primary key default gen_random_uuid(),
  step_name text unique not null,
  step_order integer not null,
  description text
);

create table if not exists lot_step_progress (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  step_id uuid not null references vinification_steps(id),
  started_at timestamptz,
  finished_at timestamptz,
  status text not null default 'pending',
  observations text,
  unique (lot_id, step_id)
);

create table if not exists vinification_log (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  event_time timestamptz not null default now(),
  event_type text not null,
  detail text not null,
  observations text
);

create table if not exists parameter_definitions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  unit text not null,
  min_acceptable numeric(12,4) not null,
  max_acceptable numeric(12,4) not null,
  warning_margin numeric(12,4) default 0,
  active boolean not null default true
);

create table if not exists parameter_readings (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references wine_lots(id) on delete cascade,
  parameter_id uuid not null references parameter_definitions(id),
  reading_time timestamptz not null default now(),
  reading_value numeric(12,4) not null,
  in_range boolean not null,
  notes text
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references wine_lots(id) on delete set null,
  parameter_reading_id uuid references parameter_readings(id) on delete set null,
  severity text not null,
  title text not null,
  message text not null,
  status text not null default 'open',
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  client_code text unique not null,
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  credit_limit numeric(12,2) default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists credits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  opened_at date not null,
  due_date date,
  original_amount numeric(12,2) not null,
  outstanding_amount numeric(12,2) not null,
  status text not null default 'open',
  notes text
);

create table if not exists sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  client_id uuid not null references clients(id),
  order_date date not null,
  expected_delivery date,
  status text not null default 'draft',
  total_amount numeric(12,2) not null default 0
);

create table if not exists sales_order_items (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references sales_orders(id) on delete cascade,
  finished_product_id uuid not null references finished_products(id),
  quantity integer not null,
  unit_price numeric(12,2) not null,
  line_total numeric(12,2) generated always as (quantity * unit_price) stored
);

create table if not exists sales_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id),
  finished_product_id uuid not null references finished_products(id),
  sold_at date not null,
  quantity integer not null,
  total_amount numeric(12,2) not null,
  reference_order_id uuid references sales_orders(id)
);

create table if not exists production_capacity (
  id uuid primary key default gen_random_uuid(),
  tank_code text unique not null,
  max_liters numeric(12,2) not null,
  current_liters numeric(12,2) not null default 0,
  lot_id uuid references wine_lots(id) on delete set null,
  status text not null default 'available',
  updated_at timestamptz not null default now()
);

create table if not exists daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date unique not null,
  active_lots integer not null default 0,
  total_liters_in_process numeric(12,2) not null default 0,
  critical_alerts integer not null default 0,
  finished_units integer not null default 0,
  notes text
);

create index if not exists idx_parameter_readings_lot_time on parameter_readings(lot_id, reading_time desc);
create index if not exists idx_vinification_log_lot_time on vinification_log(lot_id, event_time desc);
create index if not exists idx_alerts_status on alerts(status, severity, triggered_at desc);
