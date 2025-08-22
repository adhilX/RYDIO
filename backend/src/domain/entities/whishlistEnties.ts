import { ObjectId } from "mongoose"

export interface IWishlist {
    _id?:ObjectId
    user_id: string| ObjectId
    vehicle_id: [string|ObjectId]
}
