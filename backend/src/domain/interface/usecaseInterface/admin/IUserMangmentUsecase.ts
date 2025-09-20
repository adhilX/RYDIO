export interface IUserMangementUsecase {
         getUserManagementStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        blockedUsers: number;
        activePercentage: number;
        blockedPercentage: number;
        vendorAccessRequests: number;
        verificationRequests: number;
        chartData: Array<{ height: number; color: string }>;
    }>
}