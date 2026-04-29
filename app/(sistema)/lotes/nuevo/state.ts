export type LotActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export const initialLotActionState: LotActionState = { success: false, message: '' };
