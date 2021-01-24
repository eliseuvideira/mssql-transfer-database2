import { Router } from 'express';
import { postConstraints } from '../endpoints/constraints';
import { query } from '../middlewares/validation';
import { postScriptsQuery } from '../validations/scripts';

const router = Router();

/**
 * POST /constraints
 * @queryParam {string} originServer
 * @queryParam {number} originPort
 * @queryParam {string} originDatabase
 * @queryParam {string} originUser
 * @queryParam {string} originPassword
 * @queryParam {boolean} originEncrypt
 * @response 200
 * @responseContent {Constraint[]} 200.application/json
 * @response default
 * @responseContent {Error} default.application/json
 */
router.post('/constraints', query(postScriptsQuery), postConstraints);

export default router;
