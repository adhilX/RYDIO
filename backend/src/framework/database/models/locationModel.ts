import { Document, model, ObjectId } from "mongoose";
import { Location } from "../../../domain/entities/LocationEnties";
import { locationSchema } from "../schema/locationSchema";

export interface ILocationModel extends Omit<Location,'_id'>,Document{
    _id: ObjectId;
}

export const locationModel = model<Location>('location',locationSchema)