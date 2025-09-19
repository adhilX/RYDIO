import { NotificationResponseDto, UnreadCountDto, MarkAllAsReadDto, DeleteNotificationDto, DeleteAllNotificationsDto } from "../../DTOs/notificationDto/notificationDto";

export interface IGetNotificationUsecase {
    getNotificationsByUserId(userId: string): Promise<NotificationResponseDto[]>;
    markNotificationAsRead(notificationId: string): Promise<NotificationResponseDto | null>;
    markAllNotificationsAsRead(userId: string): Promise<MarkAllAsReadDto>;
    getUnreadNotificationCount(userId: string): Promise<UnreadCountDto>;
    deleteNotification(notificationId: string): Promise<DeleteNotificationDto>;
    deleteAllNotifications(userId: string): Promise<DeleteAllNotificationsDto>;
}
