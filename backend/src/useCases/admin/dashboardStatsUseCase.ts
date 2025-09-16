import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";
import { IWalletRepository } from "../../domain/interface/repositoryInterface/IWalletRepository";

export class DashboardStatsUseCase {
    constructor(
        private userRepository: IUserRepository,
        private vehicleRepository: IVehicleRepository,
        private bookingRepository: IBookingRepository,
        private walletRepository: IWalletRepository
    ) {}

    async getTotalRevenue(): Promise<{ totalRevenue: number; growthPercentage: number; chartData: number[] }> {
        try {
            // Get total revenue from completed bookings
            const totalRevenue = await this.bookingRepository.getTotalRevenue();
            
            // Get revenue from last month for growth calculation
            const lastMonthRevenue = await this.bookingRepository.getLastMonthRevenue();
            const growthPercentage = lastMonthRevenue > 0 
                ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
                : 0;

            // Get chart data for the last 8 periods
            const chartData = await this.bookingRepository.getRevenueChartData();

            return {
                totalRevenue,
                growthPercentage: Math.round(growthPercentage * 100) / 100,
                chartData
            };
        } catch (error) {
            throw new Error(`Failed to get total revenue: ${error}`);
        }
    }

    async getTotalBookings(): Promise<{ totalBookings: number; growthPercentage: number; chartData: number[] }> {
        try {
            const totalBookings = await this.bookingRepository.getTotalBookingsCount();
            const lastMonthBookings = await this.bookingRepository.getLastMonthBookingsCount();
            
            const growthPercentage = lastMonthBookings > 0 
                ? ((totalBookings - lastMonthBookings) / lastMonthBookings) * 100 
                : 0;

            const chartData = await this.bookingRepository.getBookingsChartData();

            return {
                totalBookings,
                growthPercentage: Math.round(growthPercentage * 100) / 100,
                chartData
            };
        } catch (error) {
            throw new Error(`Failed to get total bookings: ${error}`);
        }
    }

    async getTotalUsers(): Promise<{ totalUsers: number; growthPercentage: number; chartData: number[] }> {
        try {
            const totalUsers = await this.userRepository.getTotalUsersCount();
            const activeUsers = await this.userRepository.getActiveUsersCount();
            
            // Calculate growth percentage (mock calculation)
            const growthPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
            
            // Generate mock chart data
            const chartData = [65, 75, 85, 70, 80, 90, 85, 95];

            return {
                totalUsers,
                growthPercentage,
                chartData
            };
        } catch (error) {
            throw new Error(`Failed to get total users: ${error}`);
        }
    }

    async getActiveVehicles(): Promise<{ activeVehicles: number; growthPercentage: number; chartData: number[] }> {
        try {
            const activeVehicles = await this.vehicleRepository.getActiveVehiclesCount();
            const lastMonthActiveVehicles = await this.vehicleRepository.getLastMonthActiveVehiclesCount();
            
            const growthPercentage = lastMonthActiveVehicles > 0 
                ? ((activeVehicles - lastMonthActiveVehicles) / lastMonthActiveVehicles) * 100 
                : 7; // Default growth percentage

            // Generate mock chart data
            const chartData = [45, 65, 35, 85, 55, 95, 75, 80];

            return {
                activeVehicles,
                growthPercentage: Math.round(growthPercentage * 100) / 100,
                chartData
            };
        } catch (error) {
            throw new Error(`Failed to get active vehicles: ${error}`);
        }
    }
}
