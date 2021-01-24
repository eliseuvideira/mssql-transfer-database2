import { Router } from 'express';
import { postModules } from '../endpoints/modules';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /modules
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {Module[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/modules', query(postScriptsQuery), postModules);

export default router;
