import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateModule } from '../functions/getCreateModule';
import { getModules } from '../functions/getModules';

const getMissingModules = async (origin: Knex, target: Knex) => {
  const originModules = await getModules(origin);
  const targetModules = await getModules(target);

  const targetModuleNames = targetModules.map(({ module }) => module);

  return originModules.filter(
    ({ module }) => !targetModuleNames.includes(module),
  );
};

export const postModules = endpointWrapper(async (req, res, origin, target) => {
  const modules = await getMissingModules(origin, target);

  const createModules = modules.map(getCreateModule);

  for (const createModule of createModules) {
    await target.raw(createModule);
  }

  res.status(200).json(modules);
});
