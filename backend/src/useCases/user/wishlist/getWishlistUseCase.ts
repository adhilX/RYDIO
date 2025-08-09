import { IGetWishlistUseCase } from "../../../domain/interface/usecaseInterface/user/wishlist/IGetWishlistUseCase";
import { IWishlist } from "../../../domain/entities/whishlistEnties";
import { IWishlistRepository } from "../../../domain/interface/repositoryInterface/IwishlistRepository";

export class GetWishlistUseCase implements IGetWishlistUseCase{
    constructor(private _wishlistRepository: IWishlistRepository){}

    async getWishlistItem(userId:string): Promise<IWishlist|null> {
        return this._wishlistRepository.getWishlist(userId)
    }
}   