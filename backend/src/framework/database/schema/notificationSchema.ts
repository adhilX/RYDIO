import { Schema } from "mongoose";
import { INotification } from "../../../domain/entities/notificationEntities";

export const notificationSchema = new Schema<INotification>({
    userId: {
        type: String,
        refPath: 'userModel',
        required: true
    },
    userModel: {
        type: String,
        required: true,
        enum: ['user', 'owner'] 
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['booking', 'payment', 'chat', 'system', 'ride']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
})
