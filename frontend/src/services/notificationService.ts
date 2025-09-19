import type { Notification } from '@/Types/NotificationType';
import { userAxios as axiosInstance } from '@/axios/interceptors';

export const getUserNotifications = async (userId:string): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get(`/notifications/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return response.data.data;
  } catch (error) { 
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId:string) => {
  try {
    const response = await axiosInstance.patch(`/notifications/mark-all-read/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const deleteAllNotifications = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(`/notifications/delete-all/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};

export const getUnreadCount = async (userId:string) => {
  try {
    const response = await axiosInstance.get(`/notifications/unread-count/${userId}`);
    return response.data.data.unreadCount;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};
