import axios from 'axios';
import { store } from '../store/store';
import { toast } from 'react-hot-toast';

// User slices
import { addToken as addUserToken, removeToken as removeUserToken } from '@/store/slice/user/UserTokenSlice';
import { removeUser } from '@/store/slice/user/UserSlice';

// Admin slices
import { addToken as addAdminToken, removeToken as removeAdminToken } from '@/store/slice/admin/AdminTokenSlice';

const createAxiosInstance = (type = 'user') => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL,
    withCredentials: true,
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token =
        type === 'user'
          ? store.getState().userToken.userToken
          : store.getState().adminToken.adminToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        type === 'user' &&
        error.response?.status === 400 &&
        error.response?.data?.message === 'User is blocked.'
      ) {
        toast.error('Your account has been blocked.');
        store.dispatch(removeUserToken());
        window.location.href = '/login';
        return;
      }

      // Handle expired token (401)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshRes = await axios.get(
            `${import.meta.env.VITE_API_BASEURL}refresh-token`,
            { withCredentials: true }
          );

          const newAccessToken = refreshRes.data?.newAccessToken;
          if (newAccessToken) {
            if (type === 'user') {
              store.dispatch(addUserToken(newAccessToken));
            } else {
              store.dispatch(addAdminToken(newAccessToken));
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshErr) {
          if (type === 'user') {
            store.dispatch(removeUser());
            store.dispatch(removeUserToken());
            window.location.href = '/login';
          } else {
            store.dispatch(removeAdminToken());
            window.location.href = '/admin/login';
          }
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const userAxios = createAxiosInstance('user');
export const adminAxios = createAxiosInstance('admin');
