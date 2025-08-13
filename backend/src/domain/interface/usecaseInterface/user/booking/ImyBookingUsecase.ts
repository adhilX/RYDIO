import { MyBookingInputDto, MyBookingOutputDto } from "../../../DTOs/bookingDto/BookingDto";

export interface ImyBookingUsecase {
    execute({ user_id, page, limit,search,status }: MyBookingInputDto): Promise<MyBookingOutputDto | null>;
}