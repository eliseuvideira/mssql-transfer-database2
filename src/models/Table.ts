import { Column } from './Column';

export interface Table {
  schema: string;
  table: string;
  columns: Column[];
}
