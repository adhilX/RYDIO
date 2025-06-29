import axiosInstance from "@/axios/UserInterceptors";
import type { Client } from "@/Types/User/auth/TGoogle";
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

export const verifyOtp = async (otp: string, user: SignupSchema) => {
  try {
    const response = await axiosInstance.post("/verifyotp", { otp, user });
    return response?.data;
  } catch (error) {
    console.log('error while verifying OTP', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while verifying OTP');
    }
    throw new Error('Error while verifying OTP');
  }
};


export const userLogout = async () => {
    try {
      console.log('hiiiiiiiiiiii')
        const response = await axiosInstance.get('/logout')
        console.log(response)
        return response.data
    } catch (error) {
        console.log('error while client logout', error)
        if (isAxiosError(error)) throw new Error(error.response?.data.error)
        throw new Error('error while client logout')
    }
}
export const resendOpt = async (user: SignupSchema|string) => {
  try {
    const response = await axiosInstance.post('/resendotp', { user });
    return response.data;
  } catch (error) {
    console.log('error while resending OTP', error);
    if (isAxiosError(error)) throw new Error(error.response?.data?.error || 'Error while resending OTP');
    throw new Error('Error while resending OTP');
  }
}
export const forgotpasswordsendOpt = async (email: string) => {
    try {
        const response = await axiosInstance.post('/forgotpassword', { email });
        return response.data;
    } catch (error) {
        console.log('error while sending forgot password OTP', error);
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error || 'Error while sending forgot password OTP');
        }
        throw new Error('Error while sending forgot password OTP');
    }
}
export const verfysendOpt = async (email: string, otp: string) => {
  try {
    const response = await axiosInstance.post('/verifyforgotpasswordotp', { email, otp });
    return response.data;
  } catch (error) {
    console.log('error while verifying forgot password OTP', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while verifying forgot password OTP');
    }
    throw new Error('Error while verifying forgot password OTP');
  }
}
export const changePassword = async (newPassword: string,email:string) => {
  try {
    const response = await axiosInstance.patch('/changepassword', {email, newPassword });
    return response.data;
  } catch (error) {
    console.log('error while changing password', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while changing password');
    }
    throw new Error('Error while changing password');
  }
}

export const googleLogin = async (user:Client) => {
  try {
    const response = await axiosInstance.post("/googlelogin", {user})
    return response?.data;
  } catch (error) {
 console.log('error while client login', error)
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.error)
        }
        throw new Error('error while client login')
      }
};