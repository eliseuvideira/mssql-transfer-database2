import Knex from 'knex';
import { Column } from '../models/Column';
import { toCamel } from './toCamel';

export const getColumns = async (database: Knex): Promise<Column[]> => {
  const columns = await database
    .from('sys.columns AS columns')
    .innerJoin('sys.types AS types', (table) => {
      table.on('types.user_type_id', 'columns.user_type_id');
      table.andOn('types.system_type_id', 'columns.system_type_id');
    })
    .innerJoin('sys.tables AS tables', 'tables.object_id', 'columns.object_id')
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .leftJoin('sys.identity_columns AS identity_columns', (table) => {
      table.on('identity_columns.object_id', 'columns.object_id');
      table.andOn('identity_columns.column_id', 'columns.column_id');
    })
    .leftJoin('sys.indexes AS indexes', (table) => {
      table.on('indexes.object_id', 'columns.object_id');
      table.andOn('indexes.is_primary_key', database.raw('1'));
    })
    .leftJoin('sys.index_columns AS index_columns', (table) => {
      table.on('index_columns.object_id', 'columns.object_id');
      table.andOn('index_columns.column_id', 'columns.column_id');
      table.andOn('index_columns.index_id', 'indexes.index_id');
    })
    .orderBy(['tables.create_date', 'columns.object_id', 'columns.column_id'])
    .select([
      'schemas.name AS schema',
      'tables.name AS table',
      'columns.name AS column',
      'columns.column_id AS column_id',
      'types.name AS type',
      'columns.max_length AS max_length',
      'columns.precision AS precision',
      'columns.scale AS scale',
      'columns.is_nullable AS is_nullable',
      'columns.is_identity AS is_identity',
      'identity_columns.seed_value AS seed',
      'identity_columns.increment_value AS increment',
      database.raw(
        'CASE WHEN index_columns.index_column_id IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS is_primary_key',
      ),
      'index_columns.index_column_id AS primary_key_id',
    ]);

  return columns.map(toCamel) as any[];
};
