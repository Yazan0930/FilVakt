// src/controllers/fileController.ts
import { Request, Response } from 'express';
import { assignTaskToUser, getAllTasks, updateTaskStatus, unAssignTask } from '../models/fileAssignmentModel';

// Get all tasks
export const getAllTasksHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await getAllTasks();
      res.status(200).json(tasks);
    }
    catch (error) {
      res.status(500).json({ error: 'Failed to retrieve tasks', message: error.message });
    }
  }
  
  // Assign a task to a user
  export const assignTaskHandler = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const userId  = req.user.data.userId;
  
    console.log('Assigning task:', { userId, taskId });
  
    try {
      await assignTaskToUser(Number(userId), Number(taskId));
      res.status(200).json({ message: 'Task assigned successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to assign task', message: error.message });
    }
  };
  
  // Unassign a task from a user
  export const unAssignTaskHandler = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
  
    console.log('Unassigning task:', { taskId });
  
    try {
      await unAssignTask(Number(taskId));
      res.status(200).json({ message: 'Task unassigned successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to unassign task', message: error.message });
    }
  };
  
  // Update status of task
  export const updateTaskStatusHandler = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;
    const { status } = req.body;
  
    console.log('Updating task status:', { taskId, status });
  
    try {
      await updateTaskStatus(Number(taskId), String(status));
      console.log('Task status updated successfully');
      res.status(200).json({ message: 'Task status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task status', message: error.message });
    }
  };