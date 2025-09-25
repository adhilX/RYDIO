import { ObjectId } from "mongoose";

export interface INotification {
    _id?: string;
    from: ObjectId | string ;             
    to: ObjectId | string;              
    message: string;           
    read: boolean;           
    senderModel: 'user' | 'owner'
    receiverModel: 'user' | 'owner'
    type: 'warning' | 'info' | 'success' | 'error'
}
