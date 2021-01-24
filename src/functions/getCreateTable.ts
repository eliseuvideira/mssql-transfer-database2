import { Column } from '../models/Column';
import { Table } from '../models/Table';

const upper = (s: string) => (s || '').toUpperCase();

const getMaxLength = (maxLength: number, type: string) => {
  if (maxLength === -1) {
    return 'MAX';
  }
  if (['nchar', 'nvarchar'].includes(type)) {
    return `${Math.round(maxLength / 2)}`;
  }
  return `${maxLength}`;
};

const getColumn = (column: Column) => {
  if (['char', 'nchar', 'varchar', 'nvarchar'].includes(column.type)) {
    return `[${column.column}] ${upper(column.type)}(${getMaxLength(
      column.maxLength,
      column.type,
    )}) ${column.isNullable ? 'NULL' : 'NOT NULL'}`;
  }
  if (['decimal', 'numeric'].includes(column.type)) {
    return `[${column.column}] ${upper(column.type)}(${column.precision}, ${
      column.scale
    }) ${column.isNullable ? 'NULL' : 'NOT NULL'}`;
  }
  if (column.isIdentity) {
    return `[${column.column}] ${upper(column.type)} ${
      column.isNullable ? 'NULL' : 'NOT NULL'
    } IDENTITY (${column.seed}, ${column.increment})`;
  }
  return `[${column.column}] ${upper(column.type)} ${
    column.isNullable ? 'NULL' : 'NOT NULL'
  }`;
};

export const getCreateTable = ({ columns, ...table }: Table) =>
  `
CREATE TABLE [${table.schema}].[${table.table}] (
  ${columns.map(getColumn).join(',\n  ')}
);
`.trim();
