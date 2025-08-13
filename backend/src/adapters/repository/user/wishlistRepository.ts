import { IWishlistRepository } from "../../../domain/interface/repositoryInterface/IwishlistRepository";
import { IWishlist } from "../../../domain/entities/whishlistEnties";
import { wishlishModel } from "../../../framework/database/models/wishlishModel";
import { BaseRepository } from "../base/BaseRepo";


export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository{
    constructor() {
        super(wishlishModel);
    }

    async getWishlist(userId:string): Promise<IWishlist|null> {
        return wishlishModel.findOne({user_id:userId})
    }
}
