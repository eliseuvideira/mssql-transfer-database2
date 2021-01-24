import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateForeignKey } from '../functions/getCreateForeignKey';
import { getForeignKeys } from '../functions/getForeignKeys';

const getMissingForeignKeys = async (origin: Knex, target: Knex) => {
  const originForeignKeys = await getForeignKeys(origin);
  const targetForeignKeys = await getForeignKeys(target);

  const targetForeignKeyNames = targetForeignKeys.map(
    ({ foreignKey }) => foreignKey,
  );

  return originForeignKeys.filter(
    ({ foreignKey }) => !targetForeignKeyNames.includes(foreignKey),
  );
};

export const postForeignKeys = endpointWrapper(
  async (req, res, origin, target) => {
    const foreignKeys = await getMissingForeignKeys(origin, target);

    const createForeignKeys = foreignKeys.map(getCreateForeignKey);

    for (const createForeignKey of createForeignKeys) {
      await target.raw(createForeignKey);
    }

    res.status(200).json(foreignKeys);
  },
);
