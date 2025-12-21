import React, { useState } from "react";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "@/services/user/bookingService";
import type { BookingData } from "@/Types/User/Booking/BookingData";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { Lock, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "sans-serif",
      "::placeholder": {
        color: "#9ca3af",
      },
      iconColor: "#ffffff",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<null | string>(null);

  if (!user) return null;

  const {
    bookingData,
    clientSecret,
  }: { bookingData: BookingData; clientSecret: string } = location.state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setErrorMsg("");
    setPaymentStatus("Processing payment...");

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
      },
    });

    console.log(result);

    if (result.error) {
      setErrorMsg(result.error.message || "Payment failed.");
      setPaymentStatus("Payment Failed");
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      try {
        setPaymentStatus("Confirming booking...");
        const bookedData = await createBooking(
          result.paymentIntent.id,
          user._id!,
          bookingData
        );
        console.log(bookedData);
        setPaymentStatus("Payment Successful");
        toast.success("Booking confirmed successfully! 🎉");
        navigate("/payment-success", {
          replace: true,
          state: { booking_id: bookedData.booking_id },
        });
      } catch (error) {
        console.log(error);
        setErrorMsg("Payment successful but booking confirmation failed. Please contact support.");
        setPaymentStatus("Booking Failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),rgba(255,255,255,0))] font-sans text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to confirmation</span>
        </button>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
              <Lock className="w-8 h-8 text-white/90" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
              Secure Payment
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Complete your transaction securely with Stripe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Amount Display */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Amount</span>
              <span className="text-4xl font-bold text-white">₹{bookingData.total_amount.toLocaleString()}</span>
            </div>

            {/* Card Element */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1 block">Card Details</label>
              <div className="p-4 bg-black/60 border border-white/10 rounded-xl focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/40 transition-all">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-3 px-2 py-1">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-400">Your payment information is encrypted and secure.</p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
                {errorMsg}
              </div>
            )}

            {/* Status Message */}
            {paymentStatus && !errorMsg && (
              <div className={`text-center text-sm font-medium ${paymentStatus.includes("Successful") ? "text-green-400" : "text-blue-400"
                }`}>
                {paymentStatus}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !stripe}
              className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" className="border-black" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Now</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CheckoutForm);
