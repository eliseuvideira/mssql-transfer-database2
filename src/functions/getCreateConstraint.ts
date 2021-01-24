import { Constraint } from '../models/Constraint';
import { getTableName } from './getTableName';

export const getCreateConstraint = ({
  schema,
  table,
  constraint,
  definition,
}: Constraint) => `
  ALTER TABLE ${getTableName({ schema, table })}
  ADD CONSTRAINT [${constraint}] CHECK ${definition};
`;
