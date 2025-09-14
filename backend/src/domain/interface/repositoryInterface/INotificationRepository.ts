import { INotification } from "../../entities/notificationEntities";
import { IBaseRepository } from "./IbaseRepo";

export interface INotificationRepository extends IBaseRepository<INotification> {
    findByUserId(userId: string): Promise<INotification[]>;
    markAsRead(id: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<{ modifiedCount: number }>;
    getUnreadCount(userId: string): Promise<number>;
}
