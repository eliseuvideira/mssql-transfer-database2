import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateIndex } from '../functions/getCreateIndex';
import { getIndexes } from '../functions/getIndexes';

const getMissingIndexes = async (origin: Knex, target: Knex) => {
  const originIndexes = await getIndexes(origin);
  const targetIndexes = await getIndexes(target);

  const targetIndexNames = targetIndexes.map(({ index }) => index);

  return originIndexes.filter(({ index }) => !targetIndexNames.includes(index));
};

export const postIndexes = endpointWrapper(async (req, res, origin, target) => {
  const indexes = await getMissingIndexes(origin, target);

  const indexNames = [];

  for (const index of indexes) {
    await target.raw(getCreateIndex(index));

    indexNames.push(index.index);
  }

  res.status(200).json(indexNames);
});
