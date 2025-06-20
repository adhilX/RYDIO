import axiosInstance from "@/axios/Instance";
import { isAxiosError } from "axios";

export const UserBlock = async (userId:string) => {
  try {
    const response = await axiosInstance.patch(`/admin/userblock/${userId}`)
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};
export const UnbserBlock = async (userId:string) => {
  try {
    const response = await axiosInstance.patch(`/admin/unuserblock/${userId}`)
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};