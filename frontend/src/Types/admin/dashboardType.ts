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
    chartData: Array<{ day: string; bookings: number }>;
    activeCities: number;
    topCity: {
      name: string;
      bookings: number;
    };
  };
}