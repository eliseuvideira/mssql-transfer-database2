import Knex from 'knex';
import { Index } from '../models/Index';
import { IndexColumn } from '../models/IndexColumn';
import { getIndexColumns } from './getIndexColumns';
import { toCamel } from './toCamel';

const assignColumns = (index: Index, columns: IndexColumn[]) => {
  index.columns = columns.filter(
    (column) =>
      column.index === index.index &&
      column.table === index.table &&
      column.schema === index.schema,
  );

  return index;
};

export const getIndexes = async (database: Knex): Promise<Index[]> => {
  const indexes = await database
    .from('sys.indexes AS indexes')
    .innerJoin('sys.tables AS tables', 'tables.object_id', 'indexes.object_id')
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .whereNotNull('indexes.name')
    .orderBy([
      { column: 'indexes.is_primary_key', order: 'DESC' },
      { column: 'indexes.is_unique_constraint', order: 'DESC' },
      'indexes.object_id',
      'indexes.index_id',
    ])
    .select([
      'indexes.name AS index',
      'schemas.name AS schema',
      'tables.name AS table',
      'indexes.type_desc AS type',
      'indexes.is_unique AS is_unique',
      'indexes.is_primary_key AS is_primary_key',
      'indexes.is_unique_constraint AS is_unique_constraint',
      'indexes.has_filter AS has_filter',
      'indexes.filter_definition AS filter_definition',
    ]);

  const columns = await getIndexColumns(database);

  return indexes
    .map(toCamel)
    .map((index) => assignColumns(index as any, columns)) as any[];
};
