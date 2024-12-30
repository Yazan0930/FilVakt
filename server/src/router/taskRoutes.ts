import express from 'express';
import {
  getAllTasksHandler,
  assignTaskHandler,
  updateTaskStatusHandler,
  unAssignTaskHandler
} from '../controllers/fileController';
import { verifyToken } from '../controllers/userController';

const router = express.Router();

// get all tasks
router.get('/', verifyToken, getAllTasksHandler);

// Route to assign a task to a user
router.post('/:taskId/assign', verifyToken, assignTaskHandler);

// Route to unassign a task from a user
router.post('/:taskId/unassign', verifyToken, unAssignTaskHandler);

// updated status of task
router.post('/:taskId/status', verifyToken, updateTaskStatusHandler);

export default router;
