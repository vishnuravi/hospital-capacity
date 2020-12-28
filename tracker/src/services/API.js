import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: "json"
});

const axiosRequestInterceptor = async config => {
    config.headers.Authorization = `Api-Key ${process.env.REACT_APP_API_KEY}`;
    return config;
};
axiosInstance.interceptors.request.use(axiosRequestInterceptor, e => Promise.reject(e));

export default axiosInstance;