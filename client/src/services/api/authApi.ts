import axios from "axios";
import { loginProps } from "../../interfaces/loginForm.interface";
import { RegistrationProps } from "../../interfaces/registeration.interface";
import Cookies from "js-cookie";

export const postLoginApi = async (payload: loginProps) => {
  return await axios.post( import.meta.env.VITE_API_URL + "/users/login", payload);
};

export const postRegisterUser = async (payload: RegistrationProps) => {
  const cookie = Cookies.get("token");
  console.log("Cookie: ", cookie);
  console.log("Payload: ", payload);
  return await axios.post(import.meta.env.VITE_API_URL + "/users/register", payload, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const postCreateFile = async (payload: FormData) => {
  const cookie = Cookies.get("token");
  console.log("Payload: ", payload);
  return await axios.post(import.meta.env.VITE_API_URL + "/files", payload, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const getAllFiles = async () => {
  const cookie = Cookies.get("token");
  return await axios.get(import.meta.env.VITE_API_URL + "/files", {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const getFileData = async (fileId: number) => {
  const cookie = Cookies.get("token");
  console.log("FileId: ", fileId);
  return await axios.get(import.meta.env.VITE_API_URL + `/files/${fileId}`, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const getAllTasks = async () => {
  const cookie = Cookies.get("token");
  return await axios.get(import.meta.env.VITE_API_URL + "/tasks", {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const updateTaskStatus = async (taskId: number, status: string) => {
  const cookie = Cookies.get("token");
  console.log("Status: ", status);
  return await axios.post(import.meta.env.VITE_API_URL + `/tasks/${taskId}/status`, { status }, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const assignTaskToUser = async (taskId: number): Promise<void> => {
  const cookie = Cookies.get("token");
  console.log("assignTask: ", taskId);
  return await axios.post(import.meta.env.VITE_API_URL + `/tasks/${taskId}/assign`, {}, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const unAssignTask = async (taskId: number): Promise<void> => {
  const cookie = Cookies.get("token");
  console.log("unassignTask: ", taskId);
  return await axios.post(import.meta.env.VITE_API_URL + `/tasks/${taskId}/unassign`, {}, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const getAllUnreadFiles = async () => {
  const cookie = Cookies.get("token");
  return await axios.get(import.meta.env.VITE_API_URL + "/files/unread", {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}

export const markFileAsRead = async (fileId: number): Promise<void> => {
  const cookie = Cookies.get("token");
  console.log("markFileAsRead: ", fileId);
  return await axios.post(import.meta.env.VITE_API_URL + `/files/${fileId}/read`, {}, {
    headers: {
      Authorization: `Bearer ${cookie}`,
    },
  });
}