import Knex from 'knex';
import { ForeignKeyColumn } from '../models/ForeignKeyColumn';
import { toCamel } from './toCamel';

export const getForeignKeyColumns = async (
  database: Knex,
): Promise<ForeignKeyColumn[]> => {
  const columns = await database
    .from('sys.foreign_key_columns AS foreign_key_columns')
    .innerJoin(
      'sys.foreign_keys AS foreign_keys',
      'foreign_keys.object_id',
      'foreign_key_columns.constraint_object_id',
    )
    .innerJoin('sys.columns AS columns', (table) => {
      table.on('columns.object_id', 'foreign_key_columns.parent_object_id');
      table.andOn('columns.column_id', 'foreign_key_columns.parent_column_id');
    })
    .innerJoin(
      'sys.tables AS tables',
      'tables.object_id',
      'foreign_key_columns.parent_object_id',
    )
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .innerJoin('sys.columns AS referenced_columns', (table) => {
      table.on(
        'referenced_columns.object_id',
        'foreign_key_columns.referenced_object_id',
      );
      table.andOn(
        'referenced_columns.column_id',
        'foreign_key_columns.referenced_column_id',
      );
    })
    .innerJoin(
      'sys.tables AS referenced_tables',
      'referenced_tables.object_id',
      'foreign_key_columns.referenced_object_id',
    )
    .innerJoin(
      'sys.schemas AS referenced_schemas',
      'referenced_schemas.schema_id',
      'referenced_tables.schema_id',
    )
    .orderBy([
      'foreign_key_columns.constraint_object_id',
      'foreign_key_columns.constraint_column_id',
    ])
    .select([
      'schemas.name AS schema',
      'tables.name AS table',
      'referenced_schemas.name AS referenced_schema',
      'referenced_tables.name AS referenced_table',
      'foreign_keys.name AS foreign_key',
      'columns.name AS column',
      'referenced_columns.name AS referenced_column',
    ]);

  return columns.map(toCamel) as any[];
};
