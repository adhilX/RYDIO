import axiosInstance from "@/axios/Instance";
import type { StepThreeFormData } from "@/components/user/Dashboard/addVehicle/StepThree";
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle";
import { isAxiosError } from "axios";

export const postVehicle = async (vehicle:Vehicle,location:StepThreeFormData) => {
  try {
    const response = await axiosInstance.post("/add-vehicle",{vehicle,location});
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
