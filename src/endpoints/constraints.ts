import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateConstraint } from '../functions/getCreateConstraint';
import { getConstraints } from '../functions/getConstraints';

const getMissingConstraints = async (origin: Knex, target: Knex) => {
  const originConstraints = await getConstraints(origin);
  const targetConstraints = await getConstraints(target);

  const targetConstraintNames = targetConstraints.map(
    ({ constraint }) => constraint,
  );

  return originConstraints.filter(
    ({ constraint }) => !targetConstraintNames.includes(constraint),
  );
};

export const postConstraints = endpointWrapper(
  async (req, res, origin, target) => {
    const constraints = await getMissingConstraints(origin, target);

    const createConstraints = constraints.map(getCreateConstraint);

    for (const createConstraint of createConstraints) {
      await target.raw(createConstraint);
    }

    res.status(200).json(constraints);
  },
);
