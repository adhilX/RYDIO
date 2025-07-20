import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import type { BookingData } from "@/Types/User/Booking/BookingData";
import { createBooking, getCheckoutSession } from "@/services/user/bookingService";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    const bookingData: BookingData = {
      };

    useEffect(() => {
        (async () => {
            const secret = await getCheckoutSession(bookingData);
            setClientSecret(secret);
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement!,
            },
        });

        if (result.error) {
            alert(result.error.message);
        } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
            // Call API to store booking
            await createBooking(result.paymentIntent.id, result.paymentIntent.amount / 100, bookingData);
            navigate("/booking-confirmation");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={loading || !stripe}>Pay</button>
        </form>
    );
};

export default CheckoutForm;
