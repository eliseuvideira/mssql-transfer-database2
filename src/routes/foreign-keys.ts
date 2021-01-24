import { Router } from 'express';
import { postForeignKeys } from '../endpoints/foreign-keys';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /foreign-keys
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {ForeignKey[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/foreign-keys', query(postScriptsQuery), postForeignKeys);

export default router;
