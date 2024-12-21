export type FileStatus = 'unread' | 'todo' | 'done';
export type FileType = 'info' | 'todo';
export type FileTarget = 'workers' | 'chef' | 'nurse';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  target: FileTarget;
  status: FileStatus;
  uploadedAt: string;
  url: string;
}

export interface User {
  id: string;
  email: string;
  role: FileTarget;
}