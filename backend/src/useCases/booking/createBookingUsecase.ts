import { BookingData, BookingStatus, Ibooking, PaymentStatus, PaymentType } from "../../domain/entities/BookingEntities"
import { IAdminWalletRepository } from "../../domain/interface/repositoryInterface/IAdminWalletRepository"
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository"
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository"
import { IredisService } from "../../domain/interface/serviceInterface/IredisService"
import { IcreateBookingUsecase } from "../../domain/interface/usecaseInterface/user/booking/IcreateBookingUsecase"
import { idGeneratorService } from "../../framework/DI/serviceInject"

export class CreateBookingUsecase implements IcreateBookingUsecase {
  constructor(private _bookingRepository: IbookingRepostory, private _redisService: IredisService,private _vehicleRepository: IvehicleRepository,private _adminWalletRepository: IAdminWalletRepository) {
    this._bookingRepository = _bookingRepository
    this._redisService = _redisService
    this._vehicleRepository = _vehicleRepository
    this._adminWalletRepository = _adminWalletRepository
  }

  async createBooking({ bookingData, user_id, stripeIntentId }: { bookingData: BookingData, user_id: string, stripeIntentId: string }): Promise<any> {
    console.log('sdfsdfsdfsdf', bookingData)
    const redisKey = `hold:vehicle:${bookingData.vehicle_id},startDate:${bookingData.start_date},endDate:${bookingData.end_date}`;
    const owner_id= await this._vehicleRepository.getVehicleDetails(bookingData.vehicle_id).then(vehicle => vehicle?.owner_id.toString());
    if (!owner_id) throw new Error('Vehicle owner not found');
    await this._redisService.del(redisKey);

    const existingBooking = await this._bookingRepository.findByPaymentIntentId(stripeIntentId);
    if (existingBooking) return existingBooking;

    await this._adminWalletRepository.updateWalletBalance(bookingData.total_amount);
    const booking_id = await idGeneratorService.generateBookingId();

    const newBooking: Ibooking = {
      booking_id,
      user_id,
      vehicle_id: bookingData.vehicle_id,
      address: bookingData.address,
      city: bookingData.city,
      payment_type: PaymentType.Card, 
      start_date: new Date(bookingData.start_date),
      end_date: new Date(bookingData.end_date),
      total_amount: bookingData.total_amount,
      payment_intent_id: stripeIntentId,
      status: BookingStatus.booked,
      payment_status: PaymentStatus.Paid,
      
      finance: {
        security_deposit: 1000,
        fine_amount: 0,
        admin_commission: Math.round(bookingData.total_amount * 0.1),
        owner_earnings: Math.round(bookingData.total_amount * 0.9),
        is_late_return: false
      }
    }

    return await this._bookingRepository.createBooking(newBooking)
  }
}
