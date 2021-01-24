import { ForeignKey } from '../models/ForeignKey';
import { getTableName } from './getTableName';

export const getCreateForeignKey = ({
  schema,
  table,
  foreignKey,
  referencedSchema,
  referencedTable,
  columns,
}: ForeignKey) => `
  ALTER TABLE ${getTableName({ schema, table })}
  ADD CONSTRAINT [${foreignKey}] FOREIGN KEY (${columns
  .map(({ column }) => `[${column}]`)
  .join(', ')}) REFERENCES ${getTableName({
  schema: referencedSchema,
  table: referencedTable,
})} (${columns.map(({ referencedColumn }) => `[${referencedColumn}]`)});
`;
