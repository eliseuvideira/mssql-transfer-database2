import { Schema } from '../models/Schema';

export const getCreateSchema = ({ schema }: Schema) =>
  `CREATE SCHEMA ${schema};`;
