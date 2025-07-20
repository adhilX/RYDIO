import { IStripeService } from "../../../domain/interface/serviceInterface/IstripeService";
import { IcreatePaymentIntentUsecase } from "../../../domain/interface/usecaseInterface/user/booking/IcreatePaymentIntentUsecase";

export class CreatePaymentIntentUsecase implements IcreatePaymentIntentUsecase{
    constructor(private stripeService: IStripeService){
        this.stripeService = stripeService
    }
        async createPaymentIntent(amount: number): Promise<string> {
         console.log(amount)
      return  await this.stripeService.createPaymentIntent(amount)
    }
}