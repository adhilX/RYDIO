import { Document, model, ObjectId } from "mongoose";
import { INotification } from "../../../domain/entities/notificationEntities";
import { notificationSchema } from "../schema/notificationSchema";

export interface INotificationModel extends Omit<INotification,'_id'>,Document{
    _id: ObjectId;
}

export const notificationModel = model<INotification>('notification',notificationSchema)
