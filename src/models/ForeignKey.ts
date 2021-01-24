import { ForeignKeyColumn } from './ForeignKeyColumn';

export interface ForeignKey {
  schema: string;
  table: string;
  referencedSchema: string;
  referencedTable: string;
  foreignKey: string;
  columns: ForeignKeyColumn[];
}
