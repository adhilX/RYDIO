import axiosInstance from "@/axios/UserInterceptors";
import type {  BookingData } from "@/Types/User/Booking/BookingData";
import { isAxiosError } from "axios";

export const getCheckoutSession = async (bookingData :BookingData) => {
      const {vehicle,startDate,endDate,total_amount,days,user_id} = bookingData
     console.log(bookingData)

     const bookingDataBody ={vehicle,start_date:startDate,end_date:endDate,total_amount,days,user_id}
    try {
        const response = await axiosInstance.post('/create-payment-intent', {bookingDataBody});
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

export const createBooking = async (stripeIntentId: string,user_id: string, bookingData :BookingData) => {
    try {
        const response = await axiosInstance.post('/create-booking', {
            stripeIntentId,
            user_id,
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
