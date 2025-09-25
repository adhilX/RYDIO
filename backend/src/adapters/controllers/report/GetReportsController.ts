import { Request, Response } from "express";
import { IUserReportQueryUsecase } from "../../../domain/interface/usecaseInterface/report/IUserReportQueryUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class GetReportsController {
    private _userReportQueryUseCase: IUserReportQueryUsecase;

    constructor(userReportQueryUseCase: IUserReportQueryUsecase) {
        this._userReportQueryUseCase = userReportQueryUseCase;
    }

    async getReportsByUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "User ID is required"
                });
                return;
            }

            const result = await this._userReportQueryUseCase.getReportsByUser(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reports retrieved successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error getting reports by user:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve reports"
            });
        }
    }


    async getReportsByBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.params;

            if (!bookingId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Booking ID is required"
                });
                return;
            }

            const result = await this._userReportQueryUseCase.getReportsByBooking(bookingId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: "Reports retrieved successfully",
                data: result
            });
        } catch (error: any) {
            console.error("Error getting reports by booking:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to retrieve reports"
            });
        }
    }
}
