import { Router } from 'express';
import { postSchemas } from '../endpoints/schemas';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /schemas
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {Schema[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/schemas', query(postScriptsQuery), postSchemas);

export default router;
