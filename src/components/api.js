import axios from "axios";

const BASE_URL = 'http://localhost:8000/';

const api = axios.create({
    baseURL: BASE_URL,
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        if (!config.url.includes('token/refresh')) {
            const token = localStorage.getItem('accesstoken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshtoken = localStorage.getItem('refreshtoken');
                if (!refreshtoken) {
                    throw new Error("No refresh token found");
                }

                const response = await axios.post(
                    `${BASE_URL}api/token/refresh/`,
                    { refresh: refreshtoken }
                );

                const { access } = response.data;
                localStorage.setItem('accesstoken', access);

                // Set new Authorization header and retry original request
                if (!originalRequest.headers) {
                    originalRequest.headers = {};
                }
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axios(originalRequest);
            } catch (error) {
                console.error("Refresh token invalid or expired:", error.response?.data || error.message);
                localStorage.removeItem('accesstoken');
                localStorage.removeItem('refreshtoken');
                window.location.href = '/'; // Redirect to login page
            }
        }

        return Promise.reject(error);
    }
);

export default api;
