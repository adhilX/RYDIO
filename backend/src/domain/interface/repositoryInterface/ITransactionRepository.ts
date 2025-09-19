import { ITransaction } from "../../entities/transactionEntities";
import { IBaseRepository } from "./IbaseRepo";

export type ITransactionRepository = IBaseRepository<ITransaction>;
