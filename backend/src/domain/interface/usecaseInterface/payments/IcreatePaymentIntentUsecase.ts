import { CreatePaymentIntentInputDto, CreatePaymentIntentOutputDto } from "../../../DTOs/bookingDto/BookingDto";

export interface IcreatePaymentIntentUsecase{
    createPaymentIntent(input: CreatePaymentIntentInputDto): Promise<CreatePaymentIntentOutputDto>
}