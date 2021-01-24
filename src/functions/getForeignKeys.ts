import Knex from 'knex';
import { ForeignKey } from '../models/ForeignKey';
import { ForeignKeyColumn } from '../models/ForeignKeyColumn';
import { getForeignKeyColumns } from './getForeignKeyColumns';
import { toCamel } from './toCamel';

const assignColumns = (key: ForeignKey, columns: ForeignKeyColumn[]) => {
  key.columns = columns.filter(
    (column) =>
      column.foreignKey === key.foreignKey &&
      column.table === key.table &&
      column.referencedTable === key.referencedTable &&
      column.schema === key.schema &&
      column.referencedSchema === key.referencedSchema,
  );

  return key;
};

export const getForeignKeys = async (database: Knex): Promise<ForeignKey[]> => {
  const keys = await database
    .from('sys.foreign_keys AS foreign_keys')
    .innerJoin(
      'sys.tables AS tables',
      'tables.object_id',
      'foreign_keys.parent_object_id',
    )
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .innerJoin(
      'sys.tables AS referenced_tables',
      'referenced_tables.object_id',
      'foreign_keys.referenced_object_id',
    )
    .innerJoin(
      'sys.schemas AS referenced_schemas',
      'referenced_schemas.schema_id',
      'referenced_tables.schema_id',
    )
    .orderBy('foreign_keys.object_id')
    .select([
      'schemas.name AS schema',
      'tables.name AS table',
      'referenced_schemas.name AS referenced_schema',
      'referenced_tables.name AS referenced_table',
      'foreign_keys.name AS foreign_key',
    ]);

  const columns = await getForeignKeyColumns(database);

  return keys
    .map(toCamel)
    .map((key) => assignColumns(key as any, columns)) as any[];
};
