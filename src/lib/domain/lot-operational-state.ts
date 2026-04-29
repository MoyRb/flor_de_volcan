export const LOT_OPERATIONAL_STATES = [
  'Preparación de mosto',
  'Inoculación',
  'Fermentación activa',
  'Fermentación lenta',
  'Post-fermentación',
  'Ajuste de perfil',
  'Estabilización',
  'Envasado',
  'Listo para venta',
] as const;

export type LotOperationalState = (typeof LOT_OPERATIONAL_STATES)[number];

export const OPERATIONAL_STATE_TO_STAGE_CODE: Record<LotOperationalState, string> = {
  'Preparación de mosto': 'CRUSHING',
  Inoculación: 'FERMENTATION',
  'Fermentación activa': 'FERMENTATION',
  'Fermentación lenta': 'FERMENTATION',
  'Post-fermentación': 'AGING',
  'Ajuste de perfil': 'STABILIZATION',
  Estabilización: 'STABILIZATION',
  Envasado: 'BOTTLING',
  'Listo para venta': 'READY',
};

export function isLotOperationalState(value: string): value is LotOperationalState {
  return LOT_OPERATIONAL_STATES.includes(value as LotOperationalState);
}

export function getCanonicalStageCodeFromOperationalState(operationalState: string): string | null {
  if (!isLotOperationalState(operationalState)) {
    return null;
  }

  return OPERATIONAL_STATE_TO_STAGE_CODE[operationalState];
}
