import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { INotification } from "../../../domain/entities/notificationEntities";
import { notificationModel } from "../../../framework/database/models/notificationModel";
import { BaseRepository } from "../base/BaseRepo";
import { Types } from "mongoose";

export class NotificationRepository extends BaseRepository<INotification> implements INotificationRepository {
    constructor() {
        super(notificationModel)
    }

    async findByUserId(userId: string): Promise<INotification[]> {
        return await notificationModel.aggregate([
            {
                $match: {
                    to: new Types.ObjectId(userId)
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $addFields: {
                    fromObjId: {
                        $toObjectId: "$from"
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "fromObjId",
                    foreignField: "_id",
                    as: "from"
                }
            },
            {
                $unwind: {
                    path: "$from",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    from: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        profile_image: 1
                    },
                    message: 1,
                    read: 1,
                    to: 1,
                    senderModel: 1,
                    receiverModel: 1,
                    type: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ])
    }

    async markAsRead(id: string): Promise<INotification | null> {
        return await notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).populate('from')
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
