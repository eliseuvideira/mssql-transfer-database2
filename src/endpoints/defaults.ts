import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateDefault } from '../functions/getCreateDefault';
import { getDefaults } from '../functions/getDefaults';

const getMissingDefaults = async (origin: Knex, target: Knex) => {
  const originDefaults = await getDefaults(origin);
  const targetDefaults = await getDefaults(target);

  const targetDefaultNames = targetDefaults.map(
    ({ ...props }) => props.default,
  );

  return originDefaults.filter(
    ({ ...props }) => !targetDefaultNames.includes(props.default),
  );
};

export const postDefaults = endpointWrapper(
  async (req, res, origin, target) => {
    const defaults = await getMissingDefaults(origin, target);

    const createDefaults = defaults.map(getCreateDefault);

    for (const createDefault of createDefaults) {
      await target.raw(createDefault);
    }

    res.status(200).json(defaults);
  },
);
