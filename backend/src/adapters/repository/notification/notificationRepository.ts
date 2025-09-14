import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { INotification } from "../../../domain/entities/notificationEntities";
import { notificationModel } from "../../../framework/database/models/notificationModel";
import { BaseRepository } from "../base/BaseRepo";

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(notificationModel)
    }

    async findByUserId(userId: string): Promise<INotification[]> {
        return await notificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    async markAsRead(id: string): Promise<INotification | null> {
        return await notificationModel.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );
    }

    async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
        const result = await notificationModel.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );
        return { modifiedCount: result.modifiedCount };
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await notificationModel.countDocuments({ userId, isRead: false });
    }
}
