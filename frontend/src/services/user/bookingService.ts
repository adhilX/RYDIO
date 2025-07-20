import axiosInstance from "@/axios/UserInterceptors";
import type { BookingData } from "@/Types/User/Booking/BookingData";
import { isAxiosError } from "axios";

export const getCheckoutSession = async (bookingData :BookingData) => {
    try {
        const response = await axiosInstance.post('/create-payment-intent', {bookingData});
        console.log(response.data)
        return response?.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const errorMsg = error.response?.data?.error || error.message;
            throw new Error(errorMsg);
        }
        throw new Error('Unexpected error while creating payment intent');
    }
};

export const createBooking = async (
    stripeIntentId: string,
    amount: number,
    bookingData: BookingData
) => {
    try {
        const response = await axiosInstance.post('/create-booking', {
            stripeIntentId,
            amount,
            bookingData,
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            const errorMsg = error.response?.data?.error || error.message;
            throw new Error(errorMsg);
        }
        throw new Error('Unexpected error while creating booking');
    }
};
