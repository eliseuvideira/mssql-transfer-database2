import Knex from 'knex';

const MIN_POOL = 2;
const MAX_POOL = 20;

interface IDatabaseProps {
  server: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  encrypt?: boolean;
}

export const createDatabase = ({
  server,
  port,
  user,
  password,
  database,
  encrypt,
}: IDatabaseProps) =>
  Knex({
    client: 'mssql',
    connection: {
      server,
      port: port || 1433,
      user,
      password,
      database,
      options: {
        enableArithAbort: true,
        encrypt: !!encrypt,
      },
    },
    pool: {
      min: MIN_POOL,
      max: MAX_POOL,
    },
  });
