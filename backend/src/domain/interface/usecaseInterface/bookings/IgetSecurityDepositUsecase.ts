import { GetSecurityDepositOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface IgetSecurityDepositUsecase {
    getSecurityDeposit(): Promise<GetSecurityDepositOutputDto>
}