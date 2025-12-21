import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository"
import { IncomingBookingInputDto, IncomingBookingItemDto, IncomingBookingOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto"
import { IIncomingBookingUsecase } from "../../domain/interface/usecaseInterface/bookings/IIncomingBookingUsecase"

export class IncomingBookingUsecase implements IIncomingBookingUsecase{

    constructor(private _bookingRepository: IBookingRepository){}

    async execute({ owner_id, page,limit,search,status }: IncomingBookingInputDto): Promise<IncomingBookingOutputDto | null> {
        const result = await this._bookingRepository.getOwnerBookings(owner_id, limit,page, search, status);
        if (!result) return null;

        return {
            bookings: (result.bookings).map((booking:any) => ({
                booking_id: booking.booking_id,
                user: booking.user,
                vehicle: booking.vehicle,
                location: booking.location,
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
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            })),
            total: result.total
        };
    }
}