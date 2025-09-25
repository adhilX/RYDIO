import { IGetReportsOutputDto } from "../../domain/interface/DTOs/reportDto/reportDto";
import { IReportRepository } from "../../domain/interface/repositoryInterface/IReportRepository";
import { IUserReportQueryUsecase } from "../../domain/interface/usecaseInterface/report/IUserReportQueryUsecase";

export class UserReportQueryUsecase implements IUserReportQueryUsecase {
    constructor(
        private _reportRepository: IReportRepository
    ) {}

    async getReportsByUser(userId: string): Promise<IGetReportsOutputDto> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const reports = await this._reportRepository.findReportsByReporter(userId);
        
        return {
            reports: reports.map(report => ({
                _id: report._id!,
                reporterId: report.reporterId,
                bookingId: report.bookingId,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt!
            })),
            total: reports.length
        };
    }

    async getReportsByBooking(bookingId: string): Promise<IGetReportsOutputDto> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const reports = await this._reportRepository.findReportsByBooking(bookingId);
        
        return {
            reports: reports.map(report => ({
                _id: report._id!,
                reporterId: report.reporterId,
                bookingId: report.bookingId,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt!
            })),
            total: reports.length
        };
    }
}
