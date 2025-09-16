import { Request, Response } from "express";
import { DashboardStatsUseCase } from "../../../useCases/admin/dashboardStatsUseCase";
import { FinancialOverviewUseCase } from "../../../useCases/admin/financialOverviewUseCase";
import { UserManagementUseCase } from "../../../useCases/admin/userManagementUseCase";
import { VehicleManagementUseCase } from "../../../useCases/admin/vehicleManagementUseCase";
import { BookingAnalyticsUseCase } from "../../../useCases/admin/bookingAnalyticsUseCase";

export class DashboardController {
    constructor(
        private dashboardStatsUseCase: DashboardStatsUseCase,
        private financialOverviewUseCase: FinancialOverviewUseCase,
        private userManagementUseCase: UserManagementUseCase,
        private vehicleManagementUseCase: VehicleManagementUseCase,
        private bookingAnalyticsUseCase: BookingAnalyticsUseCase
    ) {}

    async getTotalRevenue(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getTotalRevenue();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get total revenue'
            });
        }
    }

    async getTotalBookings(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getTotalBookings();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get total bookings'
            });
        }
    }

    async getTotalUsers(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getTotalUsers();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get total users'
            });
        }
    }

    async getActiveVehicles(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getActiveVehicles();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get active vehicles'
            });
        }
    }

    async getFinancialOverview(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.financialOverviewUseCase.getFinancialOverview();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get financial overview'
            });
        }
    }

    async getUserManagementStats(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.userManagementUseCase.getUserManagementStats();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get user management stats'
            });
        }
    }

    async getVehicleManagementStats(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.vehicleManagementUseCase.getVehicleManagementStats();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get vehicle management stats'
            });
        }
    }

    async getBookingAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.bookingAnalyticsUseCase.getBookingAnalytics();
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get booking analytics'
            });
        }
    }

    async getAllDashboardData(req: Request, res: Response): Promise<void> {
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
                this.dashboardStatsUseCase.getTotalRevenue(),
                this.dashboardStatsUseCase.getTotalBookings(),
                this.dashboardStatsUseCase.getTotalUsers(),
                this.dashboardStatsUseCase.getActiveVehicles(),
                this.financialOverviewUseCase.getFinancialOverview(),
                this.userManagementUseCase.getUserManagementStats(),
                this.vehicleManagementUseCase.getVehicleManagementStats(),
                this.bookingAnalyticsUseCase.getBookingAnalytics()
            ]);

            res.status(200).json({
                success: true,
                data: {
                    totalRevenue,
                    totalBookings,
                    totalUsers,
                    activeVehicles,
                    financialOverview,
                    userManagement,
                    vehicleManagement,
                    bookingAnalytics
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get dashboard data'
            });
        }
    }
}
