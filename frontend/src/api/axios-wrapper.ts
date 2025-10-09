import axios from "axios";
import { BASE_URL } from "@/constant/constant";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("session_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data || response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("session_token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
