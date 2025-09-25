import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IAdminReportManagementUsecase } from "../../../domain/interface/usecaseInterface/report/IAdminReportManagementUsecase";

export class AdminReportManagementController {
    constructor(
        private _adminReportManagementUseCase: IAdminReportManagementUsecase
    ) {}

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
            const validStatuses = ['pending', 'in_review', 'resolved', 'dismissed'];
            if (!validStatuses.includes(status)) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid status. Must be one of: " + validStatuses.join(', ')
                });
                return;
            }

            const result = await this._adminReportManagementUseCase.updateReportStatus({
                reportId,
                status
            });

            if (!result.report) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: "Report not found"
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Report status updated successfully",
                data: result.report
            });
        } catch (error) {
            console.error("Error updating report status:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to update report status"
            });
        }
    }
}
