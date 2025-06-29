import axiosInstance from "@/axios/UserInterceptors";
import type { TloginForm } from "@/Types/User/auth/Tloginform";
import { isAxiosError } from "axios";

export const loginadmin = async ({email, password}:TloginForm) => {
  try {
    const response = await axiosInstance.post("/admin/login", {email,password})
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};

export const getUsers = async (search = "", page = 1, limit = 6) => {
  try {
    const response = await axiosInstance.get("/admin/searchuser", {
       params: { search, page, limit }
    });
    console.log(response.data)
    return response?.data?.users;
  } catch (error) {
    console.log('Error while fetching users:', error);
    throw error;
  }
};
