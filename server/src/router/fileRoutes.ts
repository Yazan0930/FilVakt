// src/routes/fileRoutes.ts
import express from 'express';
import {
  createFileHandler,
  getAllFilesHandler,
  getAllUnreadFilesHandler,
  getFileByIdHandler,
  markFileAsReadHandler,
} from '../controllers/fileController';
import { verifyToken } from '../controllers/userController';

const router = express.Router();

// Route to get all files
router.get('/', verifyToken, getAllFilesHandler);

// Route to create a new file
router.post('/', verifyToken, createFileHandler);

// Route to get all unread files for a user
router.get('/unread', verifyToken, getAllUnreadFilesHandler);

// Route to get a specific file by ID
router.get('/:fileId', verifyToken, getFileByIdHandler);


// Route to mark a file as read by a user
router.post('/:fileId/read', verifyToken, markFileAsReadHandler);

export default router;
