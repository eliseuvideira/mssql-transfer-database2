import { createDatabase } from './createDatabase';

export const getOrigin = ({
  originServer,
  originPort,
  originDatabase,
  originUser,
  originPassword,
  originEncrypt,
}: any) =>
  createDatabase({
    server: originServer,
    port: originPort,
    database: originDatabase,
    user: originUser,
    password: originPassword,
    encrypt: originEncrypt,
  });
