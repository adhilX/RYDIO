import { IGetReportsOutputDto } from "../../DTOs/reportDto/reportDto";

export interface IUserReportQueryUsecase {
    getReportsByUser(userId: string): Promise<IGetReportsOutputDto>;
    getReportsByBooking(bookingId: string): Promise<IGetReportsOutputDto>;
}
