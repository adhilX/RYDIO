import { Request, Response } from "express";
import { IGetReportsUsecase } from "../../../domain/interface/usecaseInterface/report/IGetReportsUsecase";
import { ICreateNotificationUsecase } from "../../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { INotification } from "../../../domain/entities/notificationEntities";

export class AdminReportController {
    private _getReportsUseCase: IGetReportsUsecase;
    private _createNotificationUseCase: ICreateNotificationUsecase;

    constructor(getReportsUseCase: IGetReportsUsecase, createNotificationUseCase: ICreateNotificationUsecase) {
        this._getReportsUseCase = getReportsUseCase;
        this._createNotificationUseCase = createNotificationUseCase;
    }

    async getAllReports(req: Request, res: Response): Promise<void> {
        try {
            const { 
                status, 
                search, 
                dateFrom, 
                dateTo, 
                page = 1, 
                limit = 10 
            } = req.query;

            const filters = {
                status: status as string,
                search: search as string,
                dateFrom: dateFrom as string,
                dateTo: dateTo as string,
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            };

            const result = await this._getReportsUseCase.getAllReportsWithFilters(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reports retrieved successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error getting all reports:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve reports"
            });
        }
    }

    async getReportById(req: Request, res: Response): Promise<void> {
        try {
            const { reportId } = req.params;

            if (!reportId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Report ID is required"
                });
                return;
            }

            const result = await this._getReportsUseCase.getReportById({ reportId });

            if (!result.report) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: "Report not found"
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Report retrieved successfully",
                data: result.report
            });
        } catch (error: any) {
            console.error("Error getting report by ID:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve report"
            });
        }
    }

    async updateReportStatus(req: Request, res: Response): Promise<void> {
        try {
            const { reportId } = req.params;
            const { status } = req.body;

            if (!reportId || !status) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Report ID and status are required"
                });
                return;
            }

            // Validate status
            const validStatuses = ['Pending', 'In Review', 'Resolved', 'Dismissed'];
            if (!validStatuses.includes(status)) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid status. Must be one of: " + validStatuses.join(', ')
                });
                return;
            }

            const result = await this._getReportsUseCase.updateReportStatus({reportId, status});

            if (!result) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: "Report not found"
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Report status updated successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error updating report status:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to update report status"
            });
        }
    }

    async getReportsStats(req: Request, res: Response): Promise<void> {
        try {
            const result = await this._getReportsUseCase.getReportsStats();

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Report statistics retrieved successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error getting report stats:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve report statistics"
            });
        }
    }

    async sendNotification(req: Request, res: Response): Promise<void> {
        try {
            const { userId, message, type = 'warning' } = req.body;

            if (!userId || !message) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "User ID and message are required"
                });
                return;
            }

            // Validate notification type
            const validTypes = ['warning', 'info', 'success', 'error'];
            if (!validTypes.includes(type)) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid notification type. Must be one of: " + validTypes.join(', ')
                });
                return;
            }

            const notification: INotification = {
                from: "Admin",
                to: userId,
                message: message,
                read: false,
                senderModel: 'owner',
                receiverModel: 'owner'
            };

            const result = await this._createNotificationUseCase.createNotification(notification);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Notification sent successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error sending notification:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to send notification"
            });
        }
    }
}
