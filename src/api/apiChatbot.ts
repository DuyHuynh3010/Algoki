// src/api/axios.ts
import axios, { AxiosRequestHeaders } from "axios";

const apiChatbot = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CHATBOT_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
apiChatbot.interceptors.request.use(
    (config) => {
        const headers = (config.headers) as AxiosRequestHeaders;

        // Chuẩn hoá key header để xoá nếu cần
        const deleteCT = () => {
            delete headers["Content-Type"];
            delete headers["content-type"];
        };

        const isFormData =
            typeof FormData !== "undefined" && config.data instanceof FormData;
        const isURLEncoded = config.data instanceof URLSearchParams;

        if (isFormData) {
            // Để trình duyệt tự set "multipart/form-data; boundary=..."
            deleteCT();
        } else if (isURLEncoded) {
            headers["Content-Type"] = "application/x-www-form-urlencoded";
        } else {
            // Mặc định JSON (trừ khi bạn đã set sẵn ở nơi gọi)
            if (!headers["Content-Type"] && !headers["content-type"]) {
                headers["Content-Type"] = "application/json; charset=utf-8";
            }
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor
apiChatbot.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
        }
        return Promise.reject(error);
    },
);

export default apiChatbot;
