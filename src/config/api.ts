import axios from "axios";

export const API_CONFIG = {
  baseURL: "http://0.0.0.0:8080/api/", // hardcode sementara
  timeout: 5000,
  enableLogging: true, // set false untuk production
};

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (API_CONFIG.enableLogging) {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (API_CONFIG.enableLogging) {
      console.log("API Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (API_CONFIG.enableLogging) {
      console.error("API Error:", error.response?.status, error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
