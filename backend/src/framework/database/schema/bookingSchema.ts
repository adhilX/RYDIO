import { Schema} from "mongoose";
import { Ibooking, BookingStatus, PaymentStatus } from "../../../domain/entities/BookingEntities";
import { IbookingModel } from "../models/bookingModel";

export const BookingSchema = new Schema<IbookingModel>(
  {
    user_id: { type: String, required: true },
    vehicle_id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    id_proof: { type: String, required: true },
    id_proof_verified: { type: Boolean, default: false },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus), 
      default: BookingStatus.Pending,
    },
    cancellation_reason: { type: String, default: '' },
    payment_intent_id: { type: String },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.Pending,
    }
  },
  { timestamps: true });
