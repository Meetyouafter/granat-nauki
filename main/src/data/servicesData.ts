export type ServiceId = 'development' | 'assessment' | 'session' | 'consultation';

export const servicePrices: Record<ServiceId, string> = {
  development: '2 500 ₽',
  assessment: '3 000 ₽',
  session: '3 500 ₽',
  consultation: '2 000 ₽',
};
