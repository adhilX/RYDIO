import { Document, model, ObjectId } from "mongoose";
import { IMessage } from "../../../domain/entities/messageEntities";
import { messageSchema } from "../schema/messageSchema";

export interface IMessageModel extends Omit<IMessage,'_id'>,Document{
    _id: ObjectId;
}

export const messageModel = model<IMessage>('message',messageSchema)