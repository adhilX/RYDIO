import { Request, Response } from "express";
import { IDashboardStatsUseCase } from "../../../domain/interface/usecaseInterface/dashboard/IDashboardStatsUseCase";
import { IFinancialOverviewUseCase } from "../../../domain/interface/usecaseInterface/dashboard/IFinancialOverviewUseCase";
import { IUserMangementUsecase } from "../../../domain/interface/usecaseInterface/admin/IUserMangmentUsecase";
import { IVehileManagmentUsecase } from "../../../domain/interface/usecaseInterface/admin/IVehicleMangementUsecase";
import { IBookingAnalyticsUseCase } from "../../../domain/interface/usecaseInterface/dashboard/IBookingAnalyticsUseCase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class DashboardController {
    constructor(
        private dashboardStatsUseCase: IDashboardStatsUseCase,
        private financialOverviewUseCase: IFinancialOverviewUseCase,
        private userManagementUseCase: IUserMangementUsecase,
        private vehicleManagementUseCase: IVehileManagmentUsecase,
        private bookingAnalyticsUseCase: IBookingAnalyticsUseCase
    ) {}

    async getTotalRevenue(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getTotalRevenue();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get total revenue'
            });
        }
    }

    async getTotalBookings(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getTotalBookings();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get total bookings'
            });
        }
    }

    async getTotalUsers(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getTotalUsers();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get total users'
            });
        }
    }

    async getActiveVehicles(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dashboardStatsUseCase.getActiveVehicles();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get active vehicles'
            });
        }
    }

    async getFinancialOverview(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.financialOverviewUseCase.getFinancialOverview();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get financial overview'
            });
        }
    }

    async getUserManagementStats(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.userManagementUseCase.getUserManagementStats();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get user management stats'
            });
        }
    }

    async getVehicleManagementStats(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.vehicleManagementUseCase.getVehicleManagementStats();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get vehicle management stats'
            });
        }
    }

    async getBookingAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.bookingAnalyticsUseCase.getBookingAnalytics();
            res.status(HttpStatus.OK).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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

            res.status(HttpStatus.OK).json({
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
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get dashboard data'
            });
        }
    }
}
