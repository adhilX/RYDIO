import { ICreateReportInputDto, ICreateReportOutputDto } from "../../DTOs/reportDto/reportDto";

export interface ICreateReportUsecase {
    createReport(input: ICreateReportInputDto): Promise<ICreateReportOutputDto>;
}
