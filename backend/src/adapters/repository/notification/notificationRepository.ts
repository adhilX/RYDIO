import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { INotification } from "../../../domain/entities/notificationEntities";
import { notificationModel } from "../../../framework/database/models/notificationModel";
import { BaseRepository } from "../base/BaseRepo";

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(notificationModel)
    }

    async findByUserId(userId: string): Promise<INotification[]> {
        return await notificationModel.find({ to: userId }).sort({ createdAt: -1 }).populate('from')
    }

    async markAsRead(id: string): Promise<INotification | null> {
        return await notificationModel.findByIdAndUpdate(id,{ read: true },{ new: true }).populate('from')
    }

    async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
        const result = await notificationModel.updateMany(
            { to: userId, read: false }, { read: true })
        return { modifiedCount: result.modifiedCount };
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await notificationModel.countDocuments({ to: userId, read: false });
    }

    async deleteNotification(id: string): Promise<{ deletedCount: number }> {
        const result = await notificationModel.deleteOne({ _id: id });
        return { deletedCount: result.deletedCount };
    }

    async deleteAllNotifications(userId: string): Promise<{ deletedCount: number }> {
        const result = await notificationModel.deleteMany({ to: userId });
        return { deletedCount: result.deletedCount };
    }
}
