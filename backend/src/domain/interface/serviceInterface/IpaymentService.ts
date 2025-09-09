export interface IStripeService{
    createPaymentIntent:(amount: number) => Promise<any>
    confirmPaymentIntent:(paymentIntentId: string) => Promise<any>
}