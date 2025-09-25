import { IGetReportsWithFiltersInputDto, IGetReportsWithFiltersOutputDto, IGetReportsStatsOutputDto, IGetReportByIdInputDto, IGetReportByIdOutputDto } from "../../DTOs/reportDto/reportDto";

export interface IAdminReportQueryUsecase {
    getAllReportsWithFilters(filters: IGetReportsWithFiltersInputDto): Promise<IGetReportsWithFiltersOutputDto>;
    getReportsStats(): Promise<IGetReportsStatsOutputDto>;
    getReportById(input: IGetReportByIdInputDto): Promise<IGetReportByIdOutputDto>;
}
