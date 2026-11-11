import axios from "axios";

import { TokenService } from "./token.service";

const api = axios.create({
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.request.use(async (config) => {
    const token = await TokenService.getAccessToken();
    const roleId = await TokenService.getRoleId();

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (roleId) config.headers.RoleId = roleId;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await TokenService.getValidAccessToken();

                if (newToken) {
                    processQueue(null, newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }

                processQueue(new Error("Refresh token failed"), null);
                return Promise.reject(error);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
