import { BookingStatus, Ibooking, PaymentStatus, PaymentType, BookingData } from "../../domain/entities/BookingEntities"
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository"
import { IAdminWalletRepository } from "../../domain/interface/repositoryInterface/IAdminWalletRepository"
import { ItrasationRepository } from "../../domain/interface/repositoryInterface/ItrasationRepository"
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository"
import { IredisService } from "../../domain/interface/serviceInterface/IredisService"
import { IcreateBookingUsecase } from "../../domain/interface/usecaseInterface/bookings/IcreateBookingUsecase"
import { setings } from "../../shared/constent"
import { CreateBookingInputDto, CreateBookingOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto"
import { idGeneratorService } from "../../framework/DI/serviceInject"

export class CreateBookingUsecase implements IcreateBookingUsecase {
  constructor(private _bookingRepository: IbookingRepostory, private _redisService: IredisService,private _vehicleRepository: IvehicleRepository,private _adminWalletRepository: IAdminWalletRepository, private _trasationRepository: ItrasationRepository) {
    this._bookingRepository = _bookingRepository
    this._redisService = _redisService
    this._vehicleRepository = _vehicleRepository
    this._adminWalletRepository = _adminWalletRepository
    this._trasationRepository = _trasationRepository
  }

  async createBooking(input: CreateBookingInputDto): Promise<CreateBookingOutputDto> {
    const { bookingData, user_id, stripeIntentId } = input;
    console.log('createBooking data:', bookingData);
    const redisKey = `hold:vehicle:${bookingData.vehicle_id},startDate:${bookingData.start_date},endDate:${bookingData.end_date}`;
    const owner_id= await this._vehicleRepository.getVehicleDetails(bookingData.vehicle_id).then(vehicle => vehicle?.owner_id.toString());
    if (!owner_id) throw new Error('Vehicle owner not found');
    await this._redisService.del(redisKey);

    const existingBooking = await this._bookingRepository.findByPaymentIntentId(stripeIntentId);
    if (existingBooking) {
      return {
        _id: existingBooking._id,
        booking_id: existingBooking.booking_id,
        user_id: existingBooking.user_id.toString(),
        vehicle_id: existingBooking.vehicle_id.toString(),
        address: existingBooking.address,
        city: existingBooking.city,
        start_date: existingBooking.start_date,
        end_date: existingBooking.end_date,
        ride_start_time: existingBooking.ride_start_time,
        ride_end_time: existingBooking.ride_end_time,
        total_amount: existingBooking.total_amount,
        finance: existingBooking.finance,
        payment_type: existingBooking.payment_type,
        status: existingBooking.status,
        payment_status: existingBooking.payment_status,
        payment_intent_id: existingBooking.payment_intent_id,
        cancellation_reason: existingBooking.cancellation_reason
      };
    }

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
        security_deposit: setings.securityDeposit,
        fine_amount: 0,
        admin_commission: Math.round(bookingData.total_amount * 0.1),
        owner_earnings: Math.round(bookingData.total_amount * 0.9),
        is_late_return: false,
        owner_withdraw:false,
        user_withdraw:false
      }
    }

    await this._trasationRepository.create({from:user_id,to:'admin',amount:bookingData.total_amount,purpose:'booking',bookingId:booking_id,transactionType:'debit'})
    const savedBooking = await this._bookingRepository.create(newBooking);
    
    return {
      _id: savedBooking._id,
      booking_id: savedBooking.booking_id,
      user_id: savedBooking.user_id.toString(),
      vehicle_id: savedBooking.vehicle_id.toString(),
      address: savedBooking.address,
      city: savedBooking.city,
      start_date: savedBooking.start_date,
      end_date: savedBooking.end_date,
      ride_start_time: savedBooking.ride_start_time,
      ride_end_time: savedBooking.ride_end_time,
      total_amount: savedBooking.total_amount,
      finance: savedBooking.finance,
      payment_type: savedBooking.payment_type,
      status: savedBooking.status,
      payment_status: savedBooking.payment_status,
      payment_intent_id: savedBooking.payment_intent_id,
      cancellation_reason: savedBooking.cancellation_reason
    };
    }
}
