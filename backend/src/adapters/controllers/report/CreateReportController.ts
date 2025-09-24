import { Request, Response } from "express";
import { ICreateReportUsecase } from "../../../domain/interface/usecaseInterface/report/ICreateReportUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class CreateReportController {
    private _createReportUseCase: ICreateReportUsecase;

    constructor(createReportUseCase: ICreateReportUsecase) {
        this._createReportUseCase = createReportUseCase;
    }

    async createReport(req: Request, res: Response): Promise<void> {
        try {
            const { reporterId, bookingId, ownerId, reason } = req.body;

            // Validate required fields
            if (!reporterId || !bookingId || !ownerId || !reason) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required fields: reporterId, bookingId, ownerId, reason"
                });
                return;
            }

            // Validate reason length
            if (reason.trim().length < 10) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Reason must be at least 10 characters long"
                });
                return;
            }

            const report = await this._createReportUseCase.createReport({
                reporterId,
                bookingId,
                ownerId,
                reason: reason.trim()
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Report created successfully",
                data: report
            });
        } catch (error: any) {
            console.error("Error creating report:", error);
            
            if (error.message === 'You have already reported this booking') {
                res.status(HttpStatus.CONFLICT).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to create report"
            });
        }
    }
}
