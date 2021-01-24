import {
  TARGET_DB_DATABASE,
  TARGET_DB_ENCRYPT,
  TARGET_DB_PASSWORD,
  TARGET_DB_PORT,
  TARGET_DB_SERVER,
  TARGET_DB_USER,
} from './constants';
import { createDatabase } from './createDatabase';

export const target = createDatabase({
  server: TARGET_DB_SERVER,
  port: TARGET_DB_PORT,
  user: TARGET_DB_USER,
  password: TARGET_DB_PASSWORD,
  database: TARGET_DB_DATABASE,
  encrypt: TARGET_DB_ENCRYPT,
});
