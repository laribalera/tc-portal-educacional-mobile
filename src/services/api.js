import axios from "axios";
import { getToken } from "../storage/token";

// emulador antroid
const BASE_URL = "http://10.0.2.2:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// semre injeta o token antes de cada request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config?.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
