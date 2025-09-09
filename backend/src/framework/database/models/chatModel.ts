import { Document, model, ObjectId } from "mongoose";
import { IChat } from "../../../domain/entities/chatEntites";
import { chatSchema } from "../schema/chatSchema";

export interface IChatModel extends Omit<IChat,'_id'>,Document{
    _id: ObjectId;
}

export const chatModel = model<IChat>('chat',chatSchema)