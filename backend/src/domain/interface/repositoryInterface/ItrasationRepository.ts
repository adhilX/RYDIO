import { ITransaction } from "../../entities/transactionEntities";

export interface ItrasationRepository {
    createTrasation(from:string,amount:number,purpose:'booking' | 'refund' | 'penalty',bookingId:string,transactionType:'debit' | 'credit'): Promise<ITransaction>
}