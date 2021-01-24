import { Router } from 'express';
import { postIndexes } from '../endpoints/indexes';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /indexes
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {Index[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/indexes', query(postScriptsQuery), postIndexes);

export default router;
