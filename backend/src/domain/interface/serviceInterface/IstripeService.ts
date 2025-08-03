export interface IStripeService {
  createPaymentIntent(amount: number): Promise<string>;
}
