import { adminAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export interface SendNotificationData {
  userId: string;
  message: string;
  type?: 'warning' | 'info' | 'success' | 'error';
}

export const sendWarningNotification = async (data: SendNotificationData) => {
  try {
    const response = await axiosInstance.post('/admin/send-notification', {
      ...data,
      type: data.type || 'warning'
    });
    return response.data;
  } catch (error) {
    console.log('Error while sending notification:', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to send notification');
    }
    throw new Error('Failed to send notification');
  }
};

// export const sendBulkNotifications = async (userIds: string[], message: string, type: 'warning' | 'info' | 'success' | 'error' = 'warning') => {
//   try {
//     const response = await axiosInstance.post('/admin/send-bulk-notifications', {
//       userIds,
//       message,
//       type
//     });
//     return response.data;
//   } catch (error) {
//     console.log('Error while sending bulk notifications:', error);
//     if (isAxiosError(error)) {
//       throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to send notifications');
//     }
//     throw new Error('Failed to send notifications');
//   }
// };
