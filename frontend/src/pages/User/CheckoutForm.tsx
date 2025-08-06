import React, { useState } from "react";
import { CardElement, useElements, useStripe, } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "@/services/user/bookingService";
import type { BookingData } from "@/Types/User/Booking/BookingData";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import toast from "react-hot-toast";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#e53e3e",
    },
  },
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
  if(!user) return
  const { bookingData, clientSecret }: { bookingData: BookingData, clientSecret: string } = location.state;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setErrorMsg("");
    setPaymentStatus("Processing...");

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
      },
    });

    console.log(result)
    if (result.error) {
      setErrorMsg(result.error.message || "Payment failed.");
      setPaymentStatus("Payment Failed");
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      try {
      const bookedData = await createBooking(result.paymentIntent.id,user._id!,bookingData);
        console.log(bookedData)
        setPaymentStatus("Payment Successful");
        toast.success("Booking successful");
        navigate("/payment-success",{replace:true, state: { booking_id: bookedData.booking_id } });
      } catch (error) {
        console.log(error)
        setErrorMsg("Booking failed. Please contact support.");
        setPaymentStatus("Payment Failed");
      }
    }

    setLoading(false);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-xl border shadow-md w-full max-w-md mx-auto mt-10 bg-white"
    >
      <h2 className="text-xl font-semibold text-center">
        Complete Your Payment
      </h2>

      <CardElement
        options={cardElementOptions}
        className="border p-3 rounded-md"
      />

      <div className="text-lg font-medium">Total: ₹{bookingData.total_amount}</div>

      {errorMsg && (
        <div className="text-red-600 text-sm font-medium">{errorMsg}</div>
      )}

      {paymentStatus && (
        <div
          className={`text-center text-base font-bold ${paymentStatus === "Payment Successful"
              ? "text-green-600"
              : "text-yellow-600"
            }`}
        >
          {paymentStatus}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-lg flex justify-center items-center"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0A8 8 0 014 12z"
            ></path>
          </svg>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};

export default React.memo(CheckoutForm);
