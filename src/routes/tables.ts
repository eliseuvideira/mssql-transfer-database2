import { Router } from 'express';
import { postTables, postTablesBulkInsert } from '../endpoints/tables';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /tables
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {Table[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/tables', query(postScriptsQuery), postTables);

/**
 * POST /tables/bulk-insert
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {string[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post(
  '/tables/bulk-insert',
  query(postScriptsQuery),
  postTablesBulkInsert,
);

export default router;
