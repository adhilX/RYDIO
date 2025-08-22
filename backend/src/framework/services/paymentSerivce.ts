import Stripe from "stripe";
import { IstripeService } from "../../domain/interface/serviceInterface/IpaymentService";

export class StripeService implements IstripeService {
    private _stripe: Stripe
    constructor() {
        this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    }

    async createPaymentIntent(amount: number): Promise<any> {
        try {
            const paymentIntent = await this._stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'inr',
                metadata: {
                    integration: 'Car Rental',
                    purpose: 'Car Booking Payment',
                    timestamp: new Date().toISOString()
                },
                automatic_payment_methods: {
                    enabled: true
                }
            });

            return paymentIntent.client_secret;
        } catch (error: any) {
            console.error("Stripe createPaymentIntent Error:", error.message);
            throw new Error("Failed to create payment intent");
        }
    }
    async confirmPaymentIntent(paymentIntentId: string): Promise<any> {
        try {
            const paymentIntent = await this._stripe.paymentIntents.confirm(paymentIntentId);
            return paymentIntent;
        } catch (error: any) {
            console.error("Stripe confirmPaymentIntent Error:", error.message);
            throw new Error("Failed to confirm payment intent");
        }
    }

}