export interface IstripeService{
    createPaymentIntent:(amount: number) => Promise<any>
    confirmPaymentIntent:(paymentIntentId: string) => Promise<any>
}