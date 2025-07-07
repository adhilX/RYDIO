import axiosInstance from "@/axios/UserInterceptors";
import type { StepThreeFormData } from "@/components/user/Dashboard/addVehicle/StepThree";
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle";
import { isAxiosError } from "axios";

export const postVehicle = async (vehicle: Vehicle, location: StepThreeFormData) => {
  try {
    const response = await axiosInstance.post("/add-vehicle", { vehicle, location });
    return response?.data;
  } catch (error) {
    console.error('Error while adding vehicle:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while adding vehicle';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while adding vehicle');
  }
};
export const getMyVehicle = async (owner_id: string, search = '', page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.post("/my-vehicle", { owner_id, search, page, limit });
    return response?.data;
  } catch (error) {
    console.error('Error while fetching vehicles:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while fetching vehicles';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while fetching vehicles');
  }
};

export const SearchVehicle = async (latitude: number|null, longitude: number|null,currentPage:number,limit:number) => {
  try {
    const response = await axiosInstance.post("/search-vehicle", { latitude, longitude,currentPage,limit });
    console.log(response.data)
    return response?.data
  } catch (error) {
    console.error('Error while searching for vehicles:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error ||error.message || 'An unknown error occurred while searching for vehicles';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while searching for vehicles');
  }
};

export const getVehicleDetails= async (id:string)=>{
 try {
  const response = await axiosInstance.get(`/vehicle-details/${id}`)
  return response.data
 } catch (error) {
    console.error('Error while fetching vehicle details:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while fetching vehicle details';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while fetching vehicle details');
  }
}
