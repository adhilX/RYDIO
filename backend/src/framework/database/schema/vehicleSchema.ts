import { Schema, model, Document, Types } from 'mongoose';
import { IVehicle } from '../../../domain/entities/vehcleEnties';

export const VehicleSchema = new Schema<IVehicle>({
    owner_id: { type: Types.ObjectId, ref: 'user',required: true },
    location_id: { type: Types.ObjectId,ref :'location', required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    registration_number: { type: String, required: true },
    fuel_type: { type: String, enum: ['petrol', 'diesel', 'electric'], required: true },
    seats: { type: Number, enum: [2, 4, 5, 7], required: true },
    car_type: { type: String, enum: ['sedan', 'hateback', 'xuv', 'suv', 'sports'], required: true },
    automatic: { type: Boolean, required: true },
    price_per_day: { type: Number, required: true },
    description: { type: String, required: true },
    admin_approve: {type: String, enum :['pending','accepted','rejected']},
    image_urls: { type: [String], required: true },
    is_available: { type: Boolean, default: true },
}, { timestamps: true });

