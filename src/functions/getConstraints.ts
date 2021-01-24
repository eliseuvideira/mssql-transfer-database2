import Knex from 'knex';
import { Constraint } from '../models/Constraint';
import { toCamel } from './toCamel';

export const getConstraints = async (database: Knex): Promise<Constraint[]> => {
  const constraints = await database
    .from('sys.check_constraints AS check_constraints')
    .innerJoin(
      'sys.tables AS tables',
      'tables.object_id',
      'check_constraints.parent_object_id',
    )
    .innerJoin(
      'sys.schemas AS schemas',
      'schemas.schema_id',
      'tables.schema_id',
    )
    .select([
      'schemas.name AS schema',
      'tables.name AS table',
      'check_constraints.name AS constraint',
      'check_constraints.definition AS definition',
    ]);

  return constraints.map(toCamel) as any[];
};
