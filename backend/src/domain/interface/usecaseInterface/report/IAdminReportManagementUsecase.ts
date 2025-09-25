import { IUpdateReportStatusInputDto, IUpdateReportStatusOutputDto } from "../../DTOs/reportDto/reportDto";

export interface IAdminReportManagementUsecase {
    updateReportStatus(input: IUpdateReportStatusInputDto): Promise<IUpdateReportStatusOutputDto>;
}
