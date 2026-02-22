export type SourceBase = {
  id: string;
  name: string;
  description?: string;
  date?: string;
  sourceType: 'finance' | 'investment';
};
