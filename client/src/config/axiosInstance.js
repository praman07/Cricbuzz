import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});


// On 401, try to refresh the access token once and retry the original request
// axiosInstance.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         const originalRequest = error.config;
//         if (
//             error.response &&
//             error.response.status === 401 &&
//             !originalRequest._retry
//         ) {
//             originalRequest._retry = true;
//             try {
//                 await axiosInstance.get("/api/auth/refresh");
//                 return axiosInstance(originalRequest);
//             } catch (refreshError) {
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default axiosInstance;