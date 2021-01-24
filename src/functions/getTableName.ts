export const getTableName = ({
  schema,
  table,
}: {
  schema: string;
  table: string;
}) => `[${schema}].[${table}]`;
