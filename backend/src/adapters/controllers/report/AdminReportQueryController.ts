import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IAdminReportQueryUsecase } from "../../../domain/interface/usecaseInterface/report/IAdminReportQueryUsecase";

export class AdminReportQueryController {
    constructor(
        private _adminReportQueryUseCase: IAdminReportQueryUsecase
    ) {}

    async getAllReports(req: Request, res: Response): Promise<void> {
        try {
            const { status, search, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

            const filters = {
                status: status as string,
                search: search as string,
                dateFrom: dateFrom as string,
                dateTo: dateTo as string,
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            };

            const result = await this._adminReportQueryUseCase.getAllReportsWithFilters(filters);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reports retrieved successfully",
                data: result
            });
        } catch (error) {
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

            const result = await this._adminReportQueryUseCase.getReportById({ reportId });

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
        } catch (error) {
            console.error("Error getting report by ID:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve report"
            });
        }
    }

    async getReportsStats(req: Request, res: Response): Promise<void> {
        try {
            const result = await this._adminReportQueryUseCase.getReportsStats();

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Report statistics retrieved successfully",
                data: result
            });
        } catch (error) {
            console.error("Error getting report statistics:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve report statistics"
            });
        }
    }
}
