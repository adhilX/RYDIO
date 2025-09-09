import { GetSecurityDepositOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IGetSecurityDepositUsecase {
    getSecurityDeposit(): Promise<GetSecurityDepositOutputDto>
}