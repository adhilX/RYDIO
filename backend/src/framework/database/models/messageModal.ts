import { Document, model, ObjectId } from "mongoose";
import { Imessage } from "../../../domain/entities/messageEntities";
import { messageSchema } from "../schema/messageSchema";

export interface IMessageModel extends Omit<Imessage,'_id'>,Document{
    _id: ObjectId;
}

export const messageModel = model<Imessage>('message',messageSchema)