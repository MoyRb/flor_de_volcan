export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      cat_units: TableDef<
        { id: string; code: string; name: string; is_active: boolean },
        { id?: string; code: string; name: string; is_active?: boolean },
        { id?: string; code?: string; name?: string; is_active?: boolean }
      >;
      cat_material_types: TableDef<
        { id: string; code: string; name: string; is_active: boolean },
        { id?: string; code: string; name: string; is_active?: boolean },
        { id?: string; code?: string; name?: string; is_active?: boolean }
      >;
      cat_lot_status: TableDef<
        { id: string; code: string; name: string; is_closed: boolean },
        { id?: string; code: string; name: string; is_closed?: boolean },
        { id?: string; code?: string; name?: string; is_closed?: boolean }
      >;
      lot_daily_metrics: TableDef<
        { id: string; lot_id: string; metric_date: string; temperature_c: number | null; ph: number | null; brix: number | null },
        { id?: string; lot_id: string; metric_date: string; temperature_c?: number | null; ph?: number | null; brix?: number | null },
        { id?: string; lot_id?: string; metric_date?: string; temperature_c?: number | null; ph?: number | null; brix?: number | null }
      >;
      lot_stage_history: TableDef<
        { id: string; lot_id: string; started_at: string; comments: string | null },
        { id?: string; lot_id: string; started_at: string; comments?: string | null },
        { id?: string; lot_id?: string; started_at?: string; comments?: string | null }
      >;
      cat_vinification_stages: TableDef<
        { id: string; code: string; name: string; stage_order: number; is_active: boolean },
        { id?: string; code: string; name: string; stage_order: number; is_active?: boolean },
        { id?: string; code?: string; name?: string; stage_order?: number; is_active?: boolean }
      >;
      process_parameters: TableDef<
        {
          id: string;
          code: string;
          name: string;
          unit_id: string | null;
          min_value: number | null;
          max_value: number | null;
          warning_low: number | null;
          warning_high: number | null;
          is_required: boolean;
          is_active: boolean;
        },
        {
          id?: string;
          code: string;
          name: string;
          unit_id?: string | null;
          min_value?: number | null;
          max_value?: number | null;
          warning_low?: number | null;
          warning_high?: number | null;
          is_required?: boolean;
          is_active?: boolean;
        },
        {
          id?: string;
          code?: string;
          name?: string;
          unit_id?: string | null;
          min_value?: number | null;
          max_value?: number | null;
          warning_low?: number | null;
          warning_high?: number | null;
          is_required?: boolean;
          is_active?: boolean;
        }
      >;
      clients: TableDef<
        {
          id: string;
          client_code: string;
          legal_name: string;
          commercial_name: string | null;
          tax_id: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          credit_limit: number;
          current_balance: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          client_code: string;
          legal_name: string;
          commercial_name?: string | null;
          tax_id?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          credit_limit?: number;
          current_balance?: number;
          is_active?: boolean;
        },
        {
          id?: string;
          client_code?: string;
          legal_name?: string;
          commercial_name?: string | null;
          tax_id?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          credit_limit?: number;
          current_balance?: number;
          is_active?: boolean;
        }
      >;
      suppliers: TableDef<
        {
          id: string;
          supplier_code: string;
          name: string;
          phone: string | null;
          email: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          supplier_code: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          is_active?: boolean;
        },
        {
          id?: string;
          supplier_code?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          notes?: string | null;
          is_active?: boolean;
        }
      >;
      raw_materials: TableDef<
        {
          id: string;
          code: string;
          name: string;
          material_type_id: string;
          base_unit_id: string;
          min_stock: number;
          current_stock: number;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          code: string;
          name: string;
          material_type_id: string;
          base_unit_id: string;
          min_stock?: number;
          current_stock?: number;
          notes?: string | null;
          is_active?: boolean;
        },
        {
          id?: string;
          code?: string;
          name?: string;
          material_type_id?: string;
          base_unit_id?: string;
          min_stock?: number;
          current_stock?: number;
          notes?: string | null;
          is_active?: boolean;
        }
      >;
      raw_material_stock_movements: TableDef<
        {
          id: string;
          raw_material_id: string;
          movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
          quantity: number;
          movement_date: string;
          unit_cost: number | null;
          supplier_id: string | null;
          lot_id: string | null;
          reference: string | null;
          notes: string | null;
        },
        {
          id?: string;
          raw_material_id: string;
          movement_type: 'IN' | 'OUT' | 'ADJUSTMENT';
          quantity: number;
          movement_date?: string;
          unit_cost?: number | null;
          supplier_id?: string | null;
          lot_id?: string | null;
          reference?: string | null;
          notes?: string | null;
        },
        {
          id?: string;
          raw_material_id?: string;
          movement_type?: 'IN' | 'OUT' | 'ADJUSTMENT';
          quantity?: number;
          movement_date?: string;
          unit_cost?: number | null;
          supplier_id?: string | null;
          lot_id?: string | null;
          reference?: string | null;
          notes?: string | null;
        }
      >;
      wine_lots: TableDef<
        {
          id: string;
          lot_code: string;
          finished_product_id: string;
          lot_status_id: string;
          current_stage_id: string;
          start_date: string;
          estimated_end_date: string | null;
          actual_end_date: string | null;
          target_volume_liters: number;
          current_volume_liters: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          lot_code: string;
          finished_product_id: string;
          lot_status_id: string;
          current_stage_id: string;
          start_date: string;
          estimated_end_date?: string | null;
          actual_end_date?: string | null;
          target_volume_liters: number;
          current_volume_liters?: number;
          notes?: string | null;
        },
        {
          id?: string;
          lot_code?: string;
          finished_product_id?: string;
          lot_status_id?: string;
          current_stage_id?: string;
          start_date?: string;
          estimated_end_date?: string | null;
          actual_end_date?: string | null;
          target_volume_liters?: number;
          current_volume_liters?: number;
          notes?: string | null;
        }
      >;
      finished_products: TableDef<
        { id: string; sku: string; name: string; presentation: string | null; is_active: boolean },
        { id?: string; sku: string; name: string; presentation?: string | null; is_active?: boolean },
        { id?: string; sku?: string; name?: string; presentation?: string | null; is_active?: boolean }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
