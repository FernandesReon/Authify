import axios from "axios";

const BASE_URL = "http://localhost:8080/user";
const ADMIN_URL = "http://localhost:8080/admin";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})


// admin
export const adminInstance = axios.create({
    baseURL: ADMIN_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})