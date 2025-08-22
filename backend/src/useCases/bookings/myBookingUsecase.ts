import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { MyBookingInputDto, MyBookingOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";
import { ImyBookingUsecase } from "../../domain/interface/usecaseInterface/bookings/ImyBookingUsecase";

export class MyBookingUsecase implements ImyBookingUsecase{
    constructor(private _bookingRepository:IbookingRepostory){
        this._bookingRepository = _bookingRepository
    }

    async execute({ user_id, page, limit,search,status }: MyBookingInputDto): Promise<MyBookingOutputDto | null> {
        const result = await this._bookingRepository.findByUserId(user_id,limit,page,search,status);
        if (!result) return null;
        
        return {
            bookings: result.bookings.map((booking: any) => ({
                _id: booking._id,
                booking_id: booking.booking_id,
                user_id: booking.user_id.toString(),
                vehicle: booking.vehicle,
                location: booking.location,
                user: booking.user,
                name: booking.name,
                phone: booking.phone,
                address: booking.address,
                city: booking.city,
                start_date: booking.start_date,
                end_date: booking.end_date,
                ride_start_time: booking.ride_start_time,
                ride_end_time: booking.ride_end_time,
                total_amount: booking.total_amount,
                finance: booking.finance,
                payment_type: booking.payment_type,
                status: booking.status,
                payment_status: booking.payment_status,
                payment_intent_id: booking.payment_intent_id,
                cancellation_reason: booking.cancellation_reason,
                createdAt: booking.createdAt
            })),
            total: result.total
        };
    }
}