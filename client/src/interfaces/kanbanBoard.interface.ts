export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    taskID: number;
    fileID: number;
    status: 'To-Do' | 'In Progress' | 'Done';
    assignedTo: number | null;
    assignedToName: string | null;
    updatedAt: string;  
    fileName: string;
  }

export type Column = {
  id: TaskStatus;
  title: string;
  onUpdateTask: (updatedTask: Task) => void;
};