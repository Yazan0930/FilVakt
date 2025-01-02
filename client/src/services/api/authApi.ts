import apiClient from "../httpService";
import { loginProps } from "../../interfaces/loginForm.interface";
import { RegistrationProps } from "../../interfaces/registeration.interface";

export const postLoginApi = (payload: loginProps) =>
  apiClient.post("/users/login", payload);

export const postRegisterUser = (payload: RegistrationProps) =>
  apiClient.post("/users/register", payload);

export const postCreateFile = (payload: FormData) =>
  apiClient.post("/files", payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getAllFiles = () => apiClient.get("/files");

export const getFileData = (fileId: string) =>
  apiClient.get(`/files/${fileId}`);

export const getAllTasks = () => apiClient.get("/tasks");

export const updateTaskStatus = (taskId: string, status: string) =>
  apiClient.post(`/tasks/${taskId}/status`, { status });

export const assignTaskToUser = (taskId: string) =>
  apiClient.post(`/tasks/${taskId}/assign`);

export const unAssignTask = (taskId: string) =>
  apiClient.post(`/tasks/${taskId}/unassign`);

export const getAllUnreadFiles = () => apiClient.get("/files/unread");

export const markFileAsRead = (fileId: string) =>
  apiClient.post(`/files/${fileId}/read`);