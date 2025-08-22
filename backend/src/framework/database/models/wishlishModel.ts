import { model } from "mongoose";
import { IWishlist } from "../../../domain/entities/whishlistEnties";
import { wishlishSchema } from "../schema/wishlistSchema";
import { Document, ObjectId } from "mongoose";

export interface IWishlistModel extends Omit<IWishlist, '_id'>, Document {
    _id: ObjectId;
}
export const wishlishModel = model<IWishlist>('Wishlist', wishlishSchema);