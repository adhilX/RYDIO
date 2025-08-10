import axios from 'axios';
import { store } from '@/store/store';
import { toast } from 'react-hot-toast';
import { addToken as addUserToken, removeToken as removeUserToken } from '@/store/slice/user/UserTokenSlice';
import { addToken as addAdminToken, removeToken as removeAdminToken } from '@/store/slice/admin/AdminTokenSlice';
import { removeUser } from '@/store/slice/user/UserSlice';
import axiosInstance from './Instance';

export const setInterceptors = () => {
  axiosInstance.interceptors.request.use((config) => {
    const adminToken = store.getState().adminToken.adminToken;
    const  userToken = store.getState().userToken.userToken;

    if (adminToken && config.headers) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken && config.headers) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const message = error.response?.data?.message;
      const code = error.response?.data?.code;
      
      const adminToken = store.getState().adminToken.adminToken;
      const userToken = store.getState().userToken.userToken;
      const isAdminRequest = !!adminToken;
      const isUserRequest = !!userToken;

      if (status === 400 && message === "User is blocked.") {
        toast.error("Your account has been blocked.");
        store.dispatch(removeUserToken());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (status === 403 && code === "USER_BLOCKED") {
        store.dispatch(removeUserToken());
        localStorage.removeItem("id");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshRes = await axios.get(
            `${import.meta.env.VITE_API_BASEURL}refresh-token`,
            { withCredentials: true }
          );
          
          const newAccessToken = refreshRes.data?.newAccessToken;
          
          if (newAccessToken) {
            if (isAdminRequest) {
              store.dispatch(addAdminToken(newAccessToken));
            } else if (isUserRequest) {
              store.dispatch(addUserToken(newAccessToken));
            }
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshErr) {
          if (isAdminRequest) {
            store.dispatch(removeAdminToken());
            window.location.href = '/admin/login';
          } else {
            store.dispatch(removeUser());
            store.dispatch(removeUserToken());
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        }
      }

      if (status === 401) {
        const url = error.config?.url || "";
        if (url.startsWith("/admin") || isAdminRequest) {
          store.dispatch(removeAdminToken());
          window.location.href = "/admin/login";
        } else {
          store.dispatch(removeUserToken());
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};