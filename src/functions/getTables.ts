import Knex from 'knex';
import { Column } from '../models/Column';
import { Table } from '../models/Table';
import { getColumns } from './getColumns';
import { toCamel } from './toCamel';

const assignColumns = (table: Table, columns: Column[]) => {
  table.columns = columns.filter(
    (column) => column.table === table.table && column.schema === table.schema,
  );

  return table;
};

export const getTables = async (database: Knex): Promise<Table[]> => {
  const tables = await database
    .from('sys.tables AS tbl')
    .innerJoin('sys.schemas AS sch', 'sch.schema_id', 'tbl.schema_id')
    .select(['sch.name AS schema', 'tbl.name AS table'])
    .orderBy('tbl.create_date');

  const columns = await getColumns(database);

  return tables
    .map(toCamel)
    .map((table) => assignColumns(table as any, columns)) as any[];
};
