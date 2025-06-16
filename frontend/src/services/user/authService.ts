import axiosInstance from "@/axios/Instance";
import type { TloginForm } from "@/Types/User/auth/Tloginform";
import type { SignupSchema } from "@/Types/User/auth/Tsignupform";
import { isAxiosError } from "axios";

export const loginUser = async ({email, password}:TloginForm) => {
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
export const userSignup = async (user:SignupSchema) => {
  try {
    const response = await axiosInstance.post("/signup", {user})
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};

export const verifyOtp = async (otp:string,user:SignupSchema) => {
  console.log(otp,user)
  try {
    const response = await axiosInstance.post("/verifyotp", {otp,user})
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};




export const userLogout = async () => {
    try {
        const response = await axiosInstance.post('/logout')
        return response.data
    } catch (error) {
        console.log('error while client logout', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while client logout')
    }
}