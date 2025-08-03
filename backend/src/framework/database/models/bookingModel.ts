import { Document, model, ObjectId } from "mongoose";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { BookingSchema } from "../schema/bookingSchema";

export interface IbookingModel extends Omit<Ibooking,'_id' >,Document{
_id:ObjectId
}

export const bookingModel = model<IbookingModel>('booking',BookingSchema)