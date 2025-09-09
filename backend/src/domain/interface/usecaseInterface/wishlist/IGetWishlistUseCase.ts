import { IWishlist } from "../../../entities/whishlistEnties";

export interface IGetWishlistUseCase {
    getWishlistItem(userId:string): Promise<IWishlist|null>
}