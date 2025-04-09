import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URI + "/api",
    withCredentials: true
});

export default instance;
