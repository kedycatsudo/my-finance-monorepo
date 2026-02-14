export type SourceBase = {
    id: string;
    sourceName: string;
    description?: string;
    date?: string;
    sourceType: 'finance' | 'investment';
};