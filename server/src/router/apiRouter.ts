import { Router } from 'express';
import { getTokenClient } from '../controllers/authController';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getFortnoxResource } from '../controllers/fortnoxService';

const router = Router();

router.use(cors({ origin: 'http://localhost:5173' })); 
router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: true }));
router.post('/auth', getTokenClient);


router.post('/:endpoint', getFortnoxResource);
export default router;
