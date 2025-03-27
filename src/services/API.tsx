import axios from "axios";
import { message } from "antd";

const API = axios.create({
    baseURL: "https://nasiya.takedaservice.uz/api",
    headers: {
        "Content-Type": "application/json",
    }
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers["Authorization"] = `Bearer ${token}`;
    }
    return req;
});


API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            message.error("Session expired. Please login again.");
            setTimeout(() => {
                window.location.replace("/login"); 
            }, 500);
        }
        return Promise.reject(err);
    }
);

export default API;
