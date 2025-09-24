import { IGetReportsOutputDto, IGetReportsWithFiltersInputDto, IGetReportsWithFiltersOutputDto, IGetReportsStatsOutputDto, IGetReportByIdInputDto, IGetReportByIdOutputDto, IUpdateReportStatusInputDto, IUpdateReportStatusOutputDto } from "../../DTOs/reportDto/reportDto";

export interface IGetReportsUsecase {
    getReportsByUser(userId: string): Promise<IGetReportsOutputDto>;
    getReportsByBooking(bookingId: string): Promise<IGetReportsOutputDto>;
    getAllReportsWithFilters(filters: IGetReportsWithFiltersInputDto): Promise<IGetReportsWithFiltersOutputDto>;
    getReportsStats(): Promise<IGetReportsStatsOutputDto>;
    getReportById(input: IGetReportByIdInputDto): Promise<IGetReportByIdOutputDto>;
    updateReportStatus(input: IUpdateReportStatusInputDto): Promise<IUpdateReportStatusOutputDto>;
}
