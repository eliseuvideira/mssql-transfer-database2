export interface Column {
  schema: string;
  table: string;
  column: string;
  columnId: number;
  type: string;
  maxLength: number;
  precision: number;
  scale: number;
  isNullable: boolean;
  isIdentity: boolean;
  seed: number | null;
  increment: number | null;
  isPrimaryKey: boolean;
  primaryKeyId: number | null;
}
