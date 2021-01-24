export interface IndexColumn {
  schema: string;
  table: string;
  index: string;
  column: string;
  isDescendingKey: boolean;
  isIncludedColumn: boolean;
}
