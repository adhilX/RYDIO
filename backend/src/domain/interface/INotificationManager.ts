import { LiveNotificationDto } from "../interface/DTOs/notificationDto/notificationDto";

export interface INotificationManagerAdapter {
    sendLiveNotification(notification: LiveNotificationDto): Promise<void>;
}