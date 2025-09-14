import { ObjectId } from "mongoose";

export interface INotification {
    _id?: string;
    from: ObjectId  ;             
    to: ObjectId;              
    message: string;           
    read: boolean;           
    senderModel: 'user' | 'owner'
    receiverModel: 'user' | 'owner'
}
