import { BookingStatus, Ibooking, PaymentStatus } from "../../../domain/entities/BookingEntities"
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository"
import { IcreateBookingUsecase } from "../../../domain/interface/usecaseInterface/user/booking/IcreateBookingUsecase"

export class CreateBookingUsecase implements IcreateBookingUsecase {
  constructor(private bookingRepository: IbookingRepostory) {
    this.bookingRepository = bookingRepository
  }

  async createBooking(booking: Ibooking): Promise<any> {
    booking.payment_status = PaymentStatus.Paid
    booking.status = BookingStatus.Pending  
    const createdBooking = await this.bookingRepository.createBooking(booking)
    return createdBooking
  }
}
