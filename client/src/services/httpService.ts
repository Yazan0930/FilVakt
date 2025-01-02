import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

let isRedirecting = false; // Prevent multiple redirects

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 403) && !isRedirecting) {
      isRedirecting = true; // Set the flag to true to block further redirects
      Cookies.remove("token");
      toast.error("Session expired. Redirecting to login...");
      
      // Add a slight delay before redirecting
      setTimeout(() => {
        isRedirecting = false; // Reset the flag after redirect
        window.location.href = "/login";
      }, 1000); // 1 second delay for better UX
    } else if (status !== 401 && status !== 403) {
      toast.error(error.response?.data || "An error occurred");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
