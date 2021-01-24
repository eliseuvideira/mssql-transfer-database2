import { IndexColumn } from './IndexColumn';

export interface Index {
  index: string;
  schema: string;
  table: string;
  type: string;
  isUnique: boolean;
  isPrimaryKey: boolean;
  isUniqueConstraint: boolean;
  hasFilter: boolean;
  filterDefinition: string;
  columns: IndexColumn[];
}
