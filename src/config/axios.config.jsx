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

export default instance;
