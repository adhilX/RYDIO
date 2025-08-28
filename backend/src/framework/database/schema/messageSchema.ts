import { Schema } from "mongoose";
import { Imessage } from "../../../domain/entities/messageEntities";

export const messageSchema = new Schema<Imessage>({
    chatId: {
        type: String,
        ref: 'chat',
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    sendedTime: {
        type: Date,
        default: Date.now
    },
    senderId: {
        type: String,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        enum: ['user', 'owner'],
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    }

}, {
    timestamps: true
})