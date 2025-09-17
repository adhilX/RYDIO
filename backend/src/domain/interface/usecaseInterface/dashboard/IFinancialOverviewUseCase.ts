export interface IFinancialOverviewUseCase {
    getFinancialOverview(): Promise<{
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
    }>;
}
