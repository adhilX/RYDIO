import { Schema } from "mongoose";
import { Ichat } from "../../../domain/entities/chatEntites";

export const chatSchema = new Schema<Ichat>({
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: String
    },
    receiverId: {
        type: String,
        refPath: 'receiverModel'
    },
    senderId: {
        type: String,
        refPath: 'senderModel'
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