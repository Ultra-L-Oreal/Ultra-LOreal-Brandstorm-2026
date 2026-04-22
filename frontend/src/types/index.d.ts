// frontend/src/types/index.d.ts
/*export interface User {
  id: string;
  phone?: string;
  name?: string;
  guest?: boolean;
}*/

export interface Recommendation {
  fragranceId: string;
  score: number;
  safetyStatus: 'SAFE' | 'CAUTION' | 'AVOID';
  explain: string;
}
