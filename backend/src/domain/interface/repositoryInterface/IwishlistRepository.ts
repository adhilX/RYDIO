import { IWishlist } from "../../entities/whishlistEnties";

export interface IWishlistRepository{
    getWishlist(userId:string): Promise<IWishlist|null>
}
