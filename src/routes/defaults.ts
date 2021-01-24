import { Router } from 'express';
import { postDefaults } from '../endpoints/defaults';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /defaults
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {Default[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/defaults', query(postScriptsQuery), postDefaults);

export default router;
