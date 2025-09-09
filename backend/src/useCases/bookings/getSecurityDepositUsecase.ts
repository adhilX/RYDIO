import { setings } from "../../domain/constants/settings";
import { GetSecurityDepositOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";
import { IGetSecurityDepositUsecase } from "../../domain/interface/usecaseInterface/bookings/IGetSecurityDepositUsecase";

export class GetSecurityDepositUsecase implements IGetSecurityDepositUsecase {
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