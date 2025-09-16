import { adminAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export interface DashboardData {
  totalRevenue: {
    totalRevenue: number;
    growthPercentage: number;
    chartData: number[];
  };
  totalBookings: {
    totalBookings: number;
    growthPercentage: number;
    chartData: number[];
  };
  totalUsers: {
    totalUsers: number;
    growthPercentage: number;
    chartData: number[];
  };
  activeVehicles: {
    activeVehicles: number;
    growthPercentage: number;
    chartData: number[];
  };
  financialOverview: {
    commission: number;
    penalties: number;
    refunds: number;
    topRevenueVehicles: Array<{
      type: string;
      model: string;
      revenue: number;
      percentage: number;
    }>;
    walletBalance: number;
  };
  userManagement: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    activePercentage: number;
    blockedPercentage: number;
    vendorAccessRequests: number;
    verificationRequests: number;
    chartData: Array<{ height: number; color: string }>;
  };
  vehicleManagement: {
    pendingVehicles: number;
    approvedVehicles: number;
    rejectedVehicles: number;
    averageRevenuePerBooking: number;
    chartData: Array<{ height: number; color: string }>;
  };
  bookingAnalytics: {
    weeklyBookingData: Array<{ day: string; bookings: number }>;
    activeCities: number;
    topCity: {
      name: string;
      bookings: number;
    };
  };
}

export const getAllDashboardData = async (): Promise<DashboardData> => {
  try {
    const [
      totalRevenue,
      totalBookings,
      totalUsers,
      activeVehicles,
      financialOverview,
      userManagement,
      vehicleManagement,
      bookingAnalytics
    ] = await Promise.all([
      getTotalRevenue(),
      getTotalBookings(),
      getTotalUsers(),
      getActiveVehicles(),
      getFinancialOverview(),
      getUserManagementStats(),
      getVehicleManagementStats(),
      getBookingAnalytics()
    ]);

    return {
      totalRevenue,
      totalBookings,
      totalUsers,
      activeVehicles,
      financialOverview,
      userManagement,
      vehicleManagement,
      bookingAnalytics
    };
  } catch (error) {
    console.log('error while fetching dashboard data', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching dashboard data');
    }
    throw new Error('Error while fetching dashboard data');
  }
};

export const getTotalRevenue = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/revenue");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching total revenue', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching total revenue');
    }
    throw new Error('Error while fetching total revenue');
  }
};

export const getTotalBookings = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/bookings");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching total bookings', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching total bookings');
    }
    throw new Error('Error while fetching total bookings');
  }
};

export const getTotalUsers = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/users");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching total users', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching total users');
    }
    throw new Error('Error while fetching total users');
  }
};

export const getActiveVehicles = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/vehicles");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching active vehicles', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching active vehicles');
    }
    throw new Error('Error while fetching active vehicles');
  }
};

export const getFinancialOverview = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/financial-overview");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching financial overview', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching financial overview');
    }
    throw new Error('Error while fetching financial overview');
  }
};

export const getUserManagementStats = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/user-management");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching user management stats', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching user management stats');
    }
    throw new Error('Error while fetching user management stats');
  }
};

export const getVehicleManagementStats = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/vehicle-management");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching vehicle management stats', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching vehicle management stats');
    }
    throw new Error('Error while fetching vehicle management stats');
  }
};

export const getBookingAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/booking-analytics");
    return response.data.data;
  } catch (error) {
    console.log('error while fetching booking analytics', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error while fetching booking analytics');
    }
    throw new Error('Error while fetching booking analytics');
  }
};
