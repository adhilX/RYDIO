export interface IcreatePaymentIntentUsecase{

    createPaymentIntent(amount: number): Promise<string>
}