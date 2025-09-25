import { IUpdateReportStatusInputDto, IUpdateReportStatusOutputDto } from "../../domain/interface/DTOs/reportDto/reportDto";
import { IReportRepository } from "../../domain/interface/repositoryInterface/IReportRepository";
import { IAdminReportManagementUsecase } from "../../domain/interface/usecaseInterface/report/IAdminReportManagementUsecase";

export class AdminReportManagementUsecase implements IAdminReportManagementUsecase {
    constructor(
        private _reportRepository: IReportRepository
    ) {}

    async updateReportStatus(input: IUpdateReportStatusInputDto): Promise<IUpdateReportStatusOutputDto> {
        if (!input.reportId || !input.status) {
            throw new Error('Report ID and status are required');
        }

        const updatedReport = await this._reportRepository.updateReportStatus(input.reportId, input.status);
        
        if (!updatedReport) {
            return { report: null };
        }

        return {
            report: {
                _id: updatedReport._id!,
                reporterId: updatedReport.reporterId,
                bookingId: updatedReport.bookingId,
                reason: updatedReport.reason,
                status: updatedReport.status,
                createdAt: updatedReport.createdAt!
            }
        };
    }
}
