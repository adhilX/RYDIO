import axiosInstance from "@/axios/Instance";
import type { TloginForm } from "@/Types/User/auth/Tloginform";
import { isAxiosError } from "axios";

export const loginadmin = async ({email, password}:TloginForm) => {
  try {
    const response = await axiosInstance.post("/login", {email,password})
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};