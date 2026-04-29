alter table wine_lots
  add column if not exists operational_state text null;

alter table wine_lots
  alter column finished_product_id drop not null;
