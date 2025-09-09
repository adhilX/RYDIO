import { findOrCreateChat, sendMessage } from '@/services/chat/chatService';
import toast from 'react-hot-toast';

export interface BookingChatData {
  bookingId: string;
  userId: string;
  ownerId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
}

export const createBookingChatRoom = async (bookingData: BookingChatData) => {
  try {
    // Create or find existing chat between user and owner
    const chatResponse = await findOrCreateChat(
      bookingData.userId,
      bookingData.ownerId,
      'user',
      'owner'
    );

    const chat = chatResponse.data.data;

    // Send initial booking confirmation message
    const initialMessage = `🚗 **Booking Confirmed!**

Vehicle: ${bookingData.vehicleName}
Booking ID: ${bookingData.bookingId}
Rental Period: ${new Date(bookingData.startDate).toLocaleDateString()} - ${new Date(bookingData.endDate).toLocaleDateString()}

Hi! I've successfully booked your vehicle. Looking forward to the rental experience! Please let me know if you have any special instructions or requirements.`;

    // Send the initial message
    await sendMessage(
      chat._id,
      bookingData.userId,
      'user',
      initialMessage
    );

    toast.success('Chat room created for your booking!');
    return {
      chatId: chat._id,
      success: true
    };

  } catch (error) {
    console.error('Error creating booking chat room:', error);
    toast.error('Failed to create chat room');
    return {
      chatId: null,
      success: false
    };
  }
};

export const notifyOwnerOfBooking = async (
  chatId: string, 
  userId: string, 
  bookingDetails: {
    bookingId: string;
    vehicleName: string;
    userMessage?: string;
  }
) => {
  try {
    const message = bookingDetails.userMessage || 
      `New booking request for ${bookingDetails.vehicleName} (ID: ${bookingDetails.bookingId})`;

    await sendMessage(chatId, userId, 'user', message);
    return true;
  } catch (error) {
    console.error('Error notifying owner:', error);
    return false;
  }
};
