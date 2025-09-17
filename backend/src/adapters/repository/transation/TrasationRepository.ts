import { ITransaction } from "../../../domain/entities/transactionEntities";
import { ITrasationRepository } from "../../../domain/interface/repositoryInterface/ITrasationRepository";
import { transactionModel } from "../../../framework/database/models/transactionModel";
import { BaseRepository } from "../base/BaseRepo";

export class TrasationRepository extends BaseRepository<ITransaction> implements ITrasationRepository{
    constructor() {
        super(transactionModel);
    }
 
}
    