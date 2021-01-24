import Knex from 'knex';
import { Default } from '../models/Default';
import { toCamel } from './toCamel';

export const getDefaults = async (database: Knex): Promise<Default[]> => {
  const defaults = await database
    .from('sys.default_constraints AS default_constraints')
    .innerJoin(
      'sys.tables AS tables',
      'tables.object_id',
      'default_constraints.parent_object_id',
    )
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .innerJoin('sys.columns AS columns', (table) => {
      table.on('columns.object_id', 'default_constraints.parent_object_id');
      table.andOn('columns.column_id', 'default_constraints.parent_column_id');
    })
    .select([
      'schemas.name AS schema',
      'tables.name AS table',
      'columns.name AS column',
      'default_constraints.name AS default',
      'default_constraints.definition AS definition',
    ]);

  return defaults.map(toCamel) as any[];
};
