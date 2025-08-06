import { Schema } from "mongoose";
import { IWishlist } from "../../../domain/entities/whishlistEnties";
export const  wishlishSchema = new Schema<IWishlist>(
    {
        user_id: { type: String, required: true },
        vehicle_id: { type: [String], required: true },
    }
)