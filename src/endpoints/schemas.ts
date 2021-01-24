import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateSchema } from '../functions/getCreateSchema';
import { getSchemas } from '../functions/getSchemas';

const getMissingSchemas = async (origin: Knex, target: Knex) => {
  const originSchemas = await getSchemas(origin);
  const targetSchemas = await getSchemas(target);

  const targetSchemaNames = targetSchemas.map(({ schema }) => schema);

  return originSchemas.filter(
    ({ schema }) => !targetSchemaNames.includes(schema),
  );
};

export const postSchemas = endpointWrapper(async (req, res, origin, target) => {
  const schemas = await getMissingSchemas(origin, target);

  const createSchemas = schemas.map(getCreateSchema);

  for (const createSchema of createSchemas) {
    await target.raw(createSchema);
  }

  res.status(200).json(schemas);
});
