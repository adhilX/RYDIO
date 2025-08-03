import { BookingData, BookingStatus, Ibooking, PaymentStatus } from "../../../domain/entities/BookingEntities"
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository"
import { IredisService } from "../../../domain/interface/serviceInterface/IredisService"
import { IcreateBookingUsecase } from "../../../domain/interface/usecaseInterface/user/booking/IcreateBookingUsecase"
import { idGeneratorService } from "../../../framework/DI/serviceInject"

export class CreateBookingUsecase implements IcreateBookingUsecase {
  constructor(private bookingRepository: IbookingRepostory, private redisService: IredisService) {
    this.bookingRepository = bookingRepository
    this.redisService = redisService
  }

  async createBooking({ bookingData, user_id, stripeIntentId }: { bookingData: BookingData, user_id: string, stripeIntentId: string }): Promise<any> {
    console.log('sdfsdfsdfsdf', bookingData)
    const redisKey = `hold:vehicle:${bookingData.vehicle_id},startDate:${bookingData.start_date},endDate:${bookingData.end_date}`;

    await this.redisService.del(redisKey);

    const existingBooking = await this.bookingRepository.findByPaymentIntentId(stripeIntentId);
    if (existingBooking) return existingBooking;

    const booking_id = await idGeneratorService.generateBookingId();
console.log(bookingData)
    const newBooking: Ibooking = {
      booking_id,
      user_id,
      vehicle_id: bookingData.vehicle_id,
      address: bookingData.address,
      city: bookingData.city,
      id_proof: String(bookingData.id_proof?._id),
      start_date: new Date(bookingData.start_date), 
      end_date: new Date(bookingData.end_date),
      total_amount: bookingData.total_amount,
      payment_intent_id: stripeIntentId,
      status: BookingStatus.booked,
      payment_status: PaymentStatus.Paid
    }

    return await this.bookingRepository.createBooking(newBooking)
  }
}
