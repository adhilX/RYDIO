import { Schema } from "mongoose";
import { INotification } from "../../../domain/entities/notificationEntities";

export const notificationSchema = new Schema<INotification>({
    from: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    to: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
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