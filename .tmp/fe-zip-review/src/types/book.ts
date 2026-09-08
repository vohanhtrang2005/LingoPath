export type BookLanguage = 'JAPANESE' | 'ENGLISH';
export type BookLevelSystem = 'JLPT' | 'CEFR';
export type BookStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface Book {
  id: string;
  name: string;
  author?: string;
  language: string;
  levelSystem: string;
  levelCode: string;
  status: string;
  createdAt?: string;
}

export interface BookFilters {
  language: string;
  levelSystem: string;
  levelCode: string;
}

export interface CreateBookRequest {
  name: string;
  author?: string;
  language: BookLanguage;
  levelSystem: BookLevelSystem;
  levelCode: string;
  status: BookStatus;
}

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const EMPTY_FILTERS: BookFilters = {
  language: '',
  levelSystem: '',
  levelCode: ''
};