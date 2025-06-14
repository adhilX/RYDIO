import { Document, model, ObjectId } from "mongoose";
import { User } from "../../../domain/entities/userEntities";
import { userSchema } from "../schema/userSchema";

export interface IUserModel extends Omit<User,'_id'>,Document{
    _id: ObjectId;
}

export const userModel = model<User>('user',userSchema)