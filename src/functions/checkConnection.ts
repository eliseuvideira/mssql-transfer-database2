import Knex from 'knex';

export const checkConnection = async (database: Knex) => {
  try {
    await database.raw('SELECT 1 AS server_status');
  } catch (err) {
    console.error(err);
    throw new Error(
      `failed to connect to ${database.client.config.connection.server}:${database.client.config.connection.port} ${database.client.config.connection.database}`,
    );
  }
};
