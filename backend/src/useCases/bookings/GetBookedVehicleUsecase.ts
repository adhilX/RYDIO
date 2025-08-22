import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { GetBookedVehicleInputDto, GetBookedVehicleOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";
import { IGetBookedVehicleUsecase } from "../../domain/interface/usecaseInterface/bookings/IGetBookedVehicleUsecase";

export class GetBookedVehicleUsecase implements IGetBookedVehicleUsecase {
  constructor(private _bookingRepository: IbookingRepostory) {
    this._bookingRepository = _bookingRepository;
  }

  async execute(input: GetBookedVehicleInputDto): Promise<GetBookedVehicleOutputDto | null> {
    const bookings = await this._bookingRepository.getBookedBookingsByVehicleId(input.vehicleId);

    if (!bookings || bookings.length === 0) {
      return null;
    }

    const unavailableDates: string[] = [];

    bookings.forEach((booking) => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);

      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        unavailableDates.push(dateStr);
        current.setDate(current.getDate() + 1);
      }
    });

    return { bookedVehicles: unavailableDates };
  }
}