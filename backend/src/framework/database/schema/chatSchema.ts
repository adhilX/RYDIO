import { Schema } from "mongoose";
import { IChat } from "../../../domain/entities/chatEntites";

export const chatSchema = new Schema<IChat>({
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date
    },
    receiverId: {
        type: String,
        ref: 'user'
    },
    senderId: {
        type: String,
        ref: 'user'
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['user', 'owner']
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['user', 'owner']
    }
}, {
    timestamps: true
})