import { Document, model, ObjectId } from "mongoose";
import { Ichat } from "../../../domain/entities/chatEntites";
import { chatSchema } from "../schema/chatSchema";

export interface IchatModel extends Omit<Ichat,'_id'>,Document{
    _id: ObjectId;
}

export const chatModel = model<Ichat>('chat',chatSchema)