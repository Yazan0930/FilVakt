// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, verifyToken } from '../controllers/userController';

const router = express.Router();

router.post('/register', verifyToken, registerUser);
router.post('/login', loginUser);
router.get('/isAuthenticated', verifyToken);

export default router;
