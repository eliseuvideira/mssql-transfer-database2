import Knex from 'knex';
import { IndexColumn } from '../models/IndexColumn';
import { toCamel } from './toCamel';

export const getIndexColumns = async (
  database: Knex,
): Promise<IndexColumn[]> => {
  const columns = await database
    .from('sys.index_columns AS index_columns')
    .innerJoin('sys.indexes AS indexes', (table) => {
      table.on('indexes.object_id', 'index_columns.object_id');
      table.andOn('indexes.index_id', 'index_columns.index_id');
    })
    .innerJoin('sys.columns AS columns', (table) => {
      table.on('columns.object_id', 'index_columns.object_id');
      table.andOn('columns.column_id', 'index_columns.column_id');
    })
    .innerJoin(
      'sys.tables AS tables',
      'tables.object_id',
      'index_columns.object_id',
    )
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .whereNotNull('indexes.name')
    .orderBy([
      'index_columns.object_id',
      'index_columns.index_id',
      'index_columns.key_ordinal',
    ])
    .select([
      'schemas.name AS schema',
      'tables.name AS table',
      'indexes.name AS index',
      'columns.name AS column',
      'index_columns.is_descending_key AS is_descending_key',
      'index_columns.is_included_column AS is_included_column',
    ]);

  return columns.map(toCamel) as any[];
};
