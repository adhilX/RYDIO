import { ITransaction } from "../../entities/transactionEntities";
import { IBaseRepository } from "./IbaseRepo";

export type ITrasationRepository = IBaseRepository<ITransaction>;