export interface ForeignKeyColumn {
  schema: string;
  table: string;
  referencedSchema: string;
  referencedTable: string;
  foreignKey: string;
  column: string;
  referencedColumn: string;
}
