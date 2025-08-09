import { ITransaction } from "../../../domain/entities/transactionEntities";
import { ItrasationRepository } from "../../../domain/interface/repositoryInterface/ItrasationRepository";
import { transactionModel } from "../../../framework/database/models/transactionModel";

export class TrasationRepository implements ItrasationRepository{
    async createTrasation(from: string, amount: number, purpose: 'booking' | 'refund' | 'penalty', bookingId: string, transactionType: 'debit' | 'credit'): Promise<ITransaction> {
        return await transactionModel.create({from,amount,purpose,bookingId,transactionType})
    }
}
    