export interface IDashboardStatsUseCase {
    getTotalRevenue(): Promise<{ 
        totalRevenue: number; 
        growthPercentage: number; 
        chartData: number[] 
    }>;
    
    getTotalBookings(): Promise<{ 
        totalBookings: number; 
        growthPercentage: number; 
        chartData: number[] 
    }>;
    
    getTotalUsers(): Promise<{ 
        totalUsers: number; 
        growthPercentage: number; 
        chartData: number[] 
    }>;
    
    getActiveVehicles(): Promise<{ 
        activeVehicles: number; 
        growthPercentage: number; 
        chartData: number[] 
    }>;
}
