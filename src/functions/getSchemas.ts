import Knex from 'knex';
import { Schema } from '../models/Schema';
import { toCamel } from './toCamel';

export const getSchemas = async (database: Knex): Promise<Schema[]> => {
  const schemas = await database
    .from('sys.schemas')
    .where('schema_id', '>', 4)
    .andWhere('schema_id', '<', 16000)
    .select('name AS schema');

  return schemas.map(toCamel) as any[];
};
