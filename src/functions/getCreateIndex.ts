import { Index } from '../models/Index';
import { IndexColumn } from '../models/IndexColumn';
import { getTableName } from './getTableName';

const getOrder = (isDescendingKey: boolean) => (isDescendingKey ? 'DESC' : '');

const formatColumn = (column: IndexColumn) =>
  `[${column.column}] ${getOrder(column.isDescendingKey)}`;

export const getCreateIndex = ({
  isPrimaryKey,
  isUniqueConstraint,
  schema,
  table,
  index,
  type,
  columns,
  isUnique,
  hasFilter,
  filterDefinition,
}: Index) => {
  if (isPrimaryKey || isUniqueConstraint) {
    return `
      ALTER TABLE ${getTableName({ schema, table })}
      ADD CONSTRAINT [${index}] ${
      isPrimaryKey ? 'PRIMARY KEY' : 'UNIQUE'
    } ${type} (${columns.map(formatColumn).join(', ')})
    `;
  }

  const includedColumns = columns
    .filter(({ isIncludedColumn }) => isIncludedColumn)
    .map(({ column }) => `[${column}]`);
  const columnNames = columns
    .filter(({ isIncludedColumn }) => !isIncludedColumn)
    .map(({ column }) => `[${column}]`);

  return `
    CREATE ${isUnique ? 'UNIQUE' : ''} INDEX [${index}] ON ${getTableName({
    schema,
    table,
  })} (${columnNames.join(',')}) ${
    includedColumns.length > 0 ? `INCLUDE (${includedColumns.join(', ')})` : ''
  } ${hasFilter ? `WHERE ${filterDefinition}` : ''}
  `;
};
