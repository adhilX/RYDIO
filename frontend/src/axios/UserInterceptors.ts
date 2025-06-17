import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_BASEURL});

axiosInstance.interceptors.request.use((config) => {
  console.log('relll',import.meta.env.VITE_BASE_URL)
  const token = store.getState().userToken.token;

  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

export default axiosInstance;
