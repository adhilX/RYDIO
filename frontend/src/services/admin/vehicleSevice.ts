import { adminAxios as axiosInstance } from "@/axios/interceptors";

export const getPendingVehicle = async (search= '',page = 1, limit = 6) => {
  try {
    const response = await axiosInstance.get("/admin/pending-vehicle", {
       params: {search,page, limit }
    });
    console.log(response.data)
    return response?.data;
  } catch (error) {
    console.log('Error while fetching pending vehicles:', error);
    throw error;
  }
};
export const getAprovedVehicle = async (search= '',page = 1, limit = 6) => {
  try {
    const response = await axiosInstance.get("/admin/aproved-vehicle", {
       params: {search,page, limit }
    });
    console.log(response.data)
    return response?.data;
  } catch (error) {
    console.log('Error while fetching aproved vehicles:', error);
    throw error;
  }
};

export const handleVehicle = async (vehicle_id:string, action: 'accepted'|'rejected', reason?: string) => {
  try {
    console.log(action)
    const response = await axiosInstance.post(`/admin/vehicle-action/${vehicle_id}`,{action,reason})
    // console.log(response.data)
    return response?.data;
  } catch (error) {
    console.log('Error while fetching pending vehicles:', error);
    throw error;
  }
};

export const getVehilceDetails = async (id:string) =>{
  try {
    const response = await axiosInstance.get(`/vehicle-details/${id}`)
    console.log(response.data)
  } catch (error) {
        console.log('Error while fetching vehicle details:', error);
    throw error;
  }
}