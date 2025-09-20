export interface IVehileManagmentUsecase {
     getVehicleManagementStats(): Promise<{
        pendingVehicles: number;
        approvedVehicles: number;
        rejectedVehicles: number;
        averageRevenuePerBooking: number;
        chartData: Array<{ height: number; color: string }>;
    }>
}