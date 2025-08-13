import { Schema, Types } from "mongoose";
import { Ibooking, BookingStatus, PaymentStatus, PaymentType } from "../../../domain/entities/BookingEntities";

export const BookingSchema = new Schema<Ibooking>({
  booking_id: { type: String, unique: true, required: true },
  user_id: { type: Types.ObjectId, ref: 'user', required: true },
  vehicle_id: { type: Types.ObjectId, ref: 'vehicle', required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },

  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true }, 
  ride_start_time: { type: Date },
  ride_end_time: { type: Date },

  total_amount: { type: Number, required: true },

  finance: {
    security_deposit: { type: Number, required: true, default: 1000 },
    fine_amount: { type: Number, default: 0 },
    admin_commission: { type: Number, default: 0 },
    owner_earnings: { type: Number, default: 0 },
    is_late_return: { type: Boolean, default: false },
    user_withdraw:{type :Boolean,default :false},
    owner_withdraw:{type:Boolean,default:false}
  },

  status: {
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.Pending,
  },
  payment_type: {
    type: String,
    enum: Object.values(PaymentType),
    required: true,
    default: PaymentType.Card
  },
  cancellation_reason: { type: String, default: '' },
  payment_intent_id: { type: String },
  payment_status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.Pending,
  }
}, { timestamps: true });
