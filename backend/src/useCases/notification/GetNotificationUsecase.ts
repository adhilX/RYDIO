import { INotificationRepository } from "../../domain/interface/repositoryInterface/INotificationRepository";
import { IGetNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/IGetNotificationUsecase";
import { NotificationResponseDto, UnreadCountDto, MarkAllAsReadDto, DeleteNotificationDto, DeleteAllNotificationsDto } from "../../domain/interface/DTOs/notificationDto/notificationDto";

export class GetNotificationUsecase implements IGetNotificationUsecase {
    constructor(private notificationRepository: INotificationRepository) {}

    private mapToNotificationDto(notification: any): NotificationResponseDto {
        return {
            _id: notification._id.toString(),
            from: {
                _id: notification.from._id.toString(),
                name: notification.from.name,
                profileImage: notification.from.profile_image || notification.from.profileImage
            },
            message: notification.message,
            read: notification.read,
            senderModel: notification.senderModel,
            receiverModel: notification.receiverModel,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt
        };
    }

    async getNotificationsByUserId(userId: string): Promise<NotificationResponseDto[]> {
        const notifications = await this.notificationRepository.findByUserId(userId);
        return notifications.map(notification => this.mapToNotificationDto(notification));
    }

    async markNotificationAsRead(notificationId: string): Promise<NotificationResponseDto | null> {
        const notification = await this.notificationRepository.markAsRead(notificationId);
        return notification ? this.mapToNotificationDto(notification) : null;
    }

    async markAllNotificationsAsRead(userId: string): Promise<MarkAllAsReadDto> {
        const result = await this.notificationRepository.markAllAsRead(userId);
        return { modifiedCount: result.modifiedCount };
    }

    async getUnreadNotificationCount(userId: string): Promise<UnreadCountDto> {
        const count = await this.notificationRepository.getUnreadCount(userId);
        return { unreadCount: count };
    }

    async deleteNotification(notificationId: string): Promise<DeleteNotificationDto> {
        const result = await this.notificationRepository.deleteNotification(notificationId);
        return { deletedCount: result.deletedCount };
    }

    async deleteAllNotifications(userId: string): Promise<DeleteAllNotificationsDto> {
        const result = await this.notificationRepository.deleteAllNotifications(userId);
        return { deletedCount: result.deletedCount };
    }
}
