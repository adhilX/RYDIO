import { Document, model, ObjectId } from "mongoose";
import { Inotification } from "../../../domain/entities/notificationEntities";
import { notificationSchema } from "../schema/notificationSchema";

export interface InotificationModel extends Omit<Inotification,'_id'>,Document{
    _id: ObjectId;
}

export const notificationModel = model<Inotification>('notification',notificationSchema)
