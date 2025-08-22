import axios from 'axios';
import { store } from '../store/store';
import { addToken, removeToken } from '@/store/slice/admin/AdminTokenSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  withCredentials: true,
}); 

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().adminToken.adminToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.get(`${import.meta.env.VITE_API_BASEURL}refresh-token`,
          { withCredentials: true }
        );
        const newAccessToken = refreshRes.data?.newAccessToken;
        if (newAccessToken) {
          store.dispatch(addToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        store.dispatch(removeToken());
        window.location.href = '/admin/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
