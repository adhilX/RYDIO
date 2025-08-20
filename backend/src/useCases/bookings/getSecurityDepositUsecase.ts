import { IgetSecurityDepositUsecase } from "../../domain/interface/usecaseInterface/bookings/IgetSecurityDepositUsecase";
import { setings } from "../../shared/constent";
import { GetSecurityDepositOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";

export class GetSecurityDepositUsecase implements IgetSecurityDepositUsecase {
  constructor() {}

  async getSecurityDeposit(): Promise<GetSecurityDepositOutputDto> {
    try {
      return {
        security_deposit: setings.securityDeposit
      };
    } catch (error) {
      console.error('Error getting security deposit:', error);
      throw error;
    }
  }
}