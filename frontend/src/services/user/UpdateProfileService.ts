import axiosInstance from "@/axios/UserInterceptors";
import type { userData } from "@/Types/User/UpdateProfile/TpdateUserData";
import { isAxiosError } from "axios";

export const updateProfile = async (ImageUrl:string, userData:userData) => {
  try {
    const response = await axiosInstance.patch("/editProfile", { ImageUrl, ...userData });
    return response?.data;
  } catch (error) {
    console.error('Error while updating profile:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while updating profile';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while updating profile');
  }
};
type Value = { current: string; newPass: string; confirm: string ;_id:string };
export const changePassword = async (value: Value) => {
  try {
    const response = await axiosInstance.patch("/change-password", { value });
    return response?.data;
  } catch (error) {
    console.error('Error while changing password:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while changing password';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while changing password');
  }
};
