import { INotificationRepository } from "../../domain/interface/repositoryInterface/INotificationRepository";
import { IGetNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/IGetNotificationUsecase";
import { NotificationResponseDto, UnreadCountDto, MarkAllAsReadDto, DeleteNotificationDto, DeleteAllNotificationsDto } from "../../domain/interface/DTOs/notificationDto/notificationDto";

export class GetNotificationUsecase implements IGetNotificationUsecase {
    constructor(private _notificationRepository: INotificationRepository) {}

    private mapToNotificationDto(notification: any): NotificationResponseDto {
        // Handle both string (Admin) and ObjectId (User) cases for 'from' field
        let fromData;
        if (typeof notification.from === 'string') {
            // Admin notification case
            fromData = {
                _id: notification.from,
                name: notification.from === 'Admin' ? 'RYDIO Admin' : notification.from,
                profileImage: ''
            };
        } else if (notification.from && notification.from._id) {
            // User notification case (populated ObjectId)
            fromData = {
                _id: notification.from._id.toString(),
                name: notification.from.name,
                profileImage: notification.from.profile_image || notification.from.profileImage || ''
            };
        } else {
            // Fallback case
            fromData = {
                _id: 'unknown',
                name: 'Unknown Sender',
                profileImage: ''
            };
        }

        return {
            _id: notification._id.toString(),
            from: fromData,
            message: notification.message,
            read: notification.read,
            senderModel: notification.senderModel,
            receiverModel: notification.receiverModel,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt
        };
    }

    async getNotificationsByUserId(userId: string): Promise<NotificationResponseDto[]> {
        const notifications = await this._notificationRepository.findByUserId(userId);
        return notifications.map(notification => this.mapToNotificationDto(notification));
    }

    async markNotificationAsRead(notificationId: string): Promise<NotificationResponseDto | null> {
        const notification = await this._notificationRepository.markAsRead(notificationId);
        return notification ? this.mapToNotificationDto(notification) : null;
    }

    async markAllNotificationsAsRead(userId: string): Promise<MarkAllAsReadDto> {
        const result = await this._notificationRepository.markAllAsRead(userId);
        return { modifiedCount: result.modifiedCount };
    }

    async getUnreadNotificationCount(userId: string): Promise<UnreadCountDto> {
        const count = await this._notificationRepository.getUnreadCount(userId);
        return { unreadCount: count };
    }

    async deleteNotification(notificationId: string): Promise<DeleteNotificationDto> {
        const result = await this._notificationRepository.deleteNotification(notificationId);
        return { deletedCount: result.deletedCount };
    }

    async deleteAllNotifications(userId: string): Promise<DeleteAllNotificationsDto> {
        const result = await this._notificationRepository.deleteAllNotifications(userId);
        return { deletedCount: result.deletedCount };
    }
}
