import { userAxios as axiosInstance } from "@/axios/interceptors";
import type { StepThreeFormData } from "@/components/user/Dashboard/addVehicle/StepThree";
import type { Vehicle } from "@/Types/User/addVehicle/Ivehicle";
import type { FilterState } from "@/Types/User/carType";
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
}

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

export const  SearchVehicle = async (
  latitude: number|null,
  longitude: number|null,
  pickupDate: string,
  returnDate: string,
  currentPage: number,
  limit: number,
  user_id: string,
  filters?: FilterState
) => {
  try {
    console.log(latitude, longitude, pickupDate, returnDate, currentPage, limit, user_id, filters)
    const response = await axiosInstance.post("/search-vehicle", {
      latitude,
      longitude,
      pickupDate,
      returnDate,
       currentPage,
       limit,
      user_id,
      filters, 
    });
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

export const updateVehicleStatus = async (vehicleId: string, status: boolean) => {
  try {
    const response = await axiosInstance.patch(`/vehicle-status/${vehicleId}`, { status });
    return response?.data;
  } catch (error) {
    console.error('Error while updating vehicle status:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while updating vehicle status';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while updating vehicle status');
  }
};

export const deleteVehicle = async (vehicleId: string) => {
  try {
    const response = await axiosInstance.delete(`/vehicle/${vehicleId}`);
    return response?.data;
  } catch (error) {
    console.error('Error while deleting vehicle:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred while deleting vehicle';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while deleting vehicle');
  }
};

export const reapplyVehicle = async (vehicleId: string) => {
  try {
    const response = await axiosInstance.post('/vehicles/reapply', { vehicleId });
    return response?.data;
  } catch (error) {
    console.error('Error while reapplying vehicle:', error);
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'An unknown error occurred while reapplying vehicle';
      throw new Error(errorMsg);
    }
    throw new Error('An unexpected error occurred while reapplying vehicle');
  }
};
