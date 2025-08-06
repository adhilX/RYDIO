import { Schema, Types } from "mongoose";
import { Ibooking, BookingStatus, PaymentStatus, PaymentType } from "../../../domain/entities/BookingEntities";
import { IbookingModel } from "../models/bookingModel";

export const BookingSchema = new Schema<IbookingModel>(
    {
        booking_id: {
            type: String,
            unique: true,
            required: true
        },
        user_id: { type: Types.ObjectId, ref: 'user', required: true },
        vehicle_id: { type: Types.ObjectId, ref: 'vehicle', required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        total_amount: { type: Number, required: true },
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
    },
    { timestamps: true });
