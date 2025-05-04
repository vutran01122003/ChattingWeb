import axios from "axios";
import { getUserCredentials } from "../utils";

const publicEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-otp",
    "/user/request-reset-password",
    "/user/verify-reset-password",
    "/user/reset-password",
    "/auth/generateQRSession",
    "/auth/checkQRSession",
    "/user/getAllUser",
    "user/getUserBySearch",
    "/user/check-friendShip",
    "/user/send-friend-request",
    "/user/check-send-friend-request",
    "/user/cancel-friend-request"
];

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI
});

instance.interceptors.request.use(
    async function (config) {
        const { accessToken } = getUserCredentials();

        const isPublicRequest = publicEndpoints.some((endpoint) => config.url.includes(endpoint));

        if (!isPublicRequest) {
            if (accessToken) config.headers["authorization"] = accessToken;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { refreshToken, clientId } = getUserCredentials();

        if (error.response?.status === 401 && !originalRequest._retry && refreshToken && clientId) {
            originalRequest._retry = true;

            try {
                const response = await instance.post(
                    "/auth/refresh-token",
                    {},
                    {
                        headers: {
                            "x-client-id": clientId,
                            "refresh-token": refreshToken
                        }
                    }
                );
                const { accessToken, refreshToken: refresh } = response.data.metadata.tokens;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refresh);

                originalRequest.headers["authorization"] = accessToken;

                return instance(originalRequest);
            } catch (error) {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
