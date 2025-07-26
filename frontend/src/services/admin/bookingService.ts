import axiosInstance from "@/axios/AdminInterceptors";
import type { IbookedData } from "@/Types/User/Booking/bookedData";

export const getBookings = async (search = "", page = 1, limit = 6): Promise<{bookings: IbookedData[], total: number}> => {
  try {
    const response = await axiosInstance.post("/admin/bookings", {search, page, limit });
    return {
      bookings: response.data.bookings || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error while fetching bookings:', error);
    throw error;
  }
};

