export interface GetvehilceStatusOutputDto {
    pendingVehicles: number;
    approvedVehicles: number;
    rejectedVehicles: number;
    averageRevenuePerBooking: number;
    chartData: Array<{ height: number; color: string }>
}

export interface GetuserStatusOutputDto {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    activePercentage: number;
    blockedPercentage: number;
    vendorAccessRequests: number;
    verificationRequests: number;
    chartData: Array<{ height: number; color: string }>
}



export interface IGetBookingAnalyticsOutPutDto {
    chartData: Array<{ day: string; bookings: number }>;
    activeCities: number;
    topCity: {
        name: string;
        bookings: number;
    }
}


export interface IGetTotalReviewOutputDto {
    totalRevenue: number; growthPercentage: number; chartData: number[]
}


export interface IFinancialOverviewOutPutDto {

    commission: number;
    penalties: number;
    refunds: number;
    topRevenueVehicles: Array<{
        type: string;
        model: string;
        revenue: number;
        percentage: number;

    }>
    walletBalance: number;
}
