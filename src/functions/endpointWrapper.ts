import { Request, Response } from 'express';
import Knex from 'knex';
import { checkConnection } from './checkConnection';
import { endpoint } from './endpoint';
import { getOrigin } from './getOrigin';
import { target } from './targetDatabase';

const wrapper = async (
  origin: Knex,
  target: Knex,
  fn: (origin: Knex, target: Knex) => Promise<void>,
) => {
  try {
    await checkConnection(origin);
    await fn(origin, target);
  } finally {
    origin.destroy();
  }
};

export const endpointWrapper = (
  handler: (
    req: Request,
    res: Response,
    origin: Knex,
    target: Knex,
  ) => Promise<void>,
) =>
  endpoint(async (req, res) => {
    const origin = getOrigin(req.query);

    await wrapper(origin, target, async (origin, target) => {
      await handler(req, res, origin, target);
    });
  });
