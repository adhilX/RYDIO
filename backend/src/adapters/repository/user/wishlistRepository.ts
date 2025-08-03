import { IWishlistRepository } from "../../../domain/interface/repositoryInterface/IwishlistRepository";
import { IWishlist } from "../../../domain/entities/whishlistEnties";
import { wishlishModel } from "../../../framework/database/models/wishlishModel";


export class WishlistRepository implements IWishlistRepository{

    async getWishlist(userId:string): Promise<IWishlist|null> {
        return wishlishModel.findOne({user_id:userId})
    }
}
