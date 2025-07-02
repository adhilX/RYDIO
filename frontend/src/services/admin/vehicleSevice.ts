import axiosInstance from "@/axios/UserInterceptors";

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

export const handleVehicle = async (vehicle_id:string, action: 'accepted'|'rejected') => {
  try {
    console.log(action)
    const response = await axiosInstance.post(`/admin/vehicle-upprove/${vehicle_id}`,{action})
    // console.log(response.data)
    return response?.data;
  } catch (error) {
    console.log('Error while fetching pending vehicles:', error);
    throw error;
  }
};
