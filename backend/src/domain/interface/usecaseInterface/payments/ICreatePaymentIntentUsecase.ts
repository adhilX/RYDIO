import { CreatePaymentIntentInputDto, CreatePaymentIntentOutputDto } from "../../DTOs/bookingDto/BookingDto";

export interface ICreatePaymentIntentUsecase{
    createPaymentIntent(input: CreatePaymentIntentInputDto): Promise<CreatePaymentIntentOutputDto>
}