import { Default } from '../models/Default';
import { getTableName } from './getTableName';

export const getCreateDefault = ({
  schema,
  table,
  definition,
  column,
  ...other
}: Default) => `
  ALTER TABLE ${getTableName({ schema, table })}
  ADD CONSTRAINT [${other.default}] DEFAULT ${definition} FOR [${column}];
`;
