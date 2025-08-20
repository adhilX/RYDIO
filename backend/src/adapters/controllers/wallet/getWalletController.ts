import { Request, Response } from "express";
import { IgetWalletUsecase } from "../../../domain/interface/usecaseInterface/wallets/IgetWalletUsecase";

export class GetWalletController{
    constructor(private getWalletUsecase: IgetWalletUsecase) {
        this.getWalletUsecase = getWalletUsecase;
    }

    async getWalletDetails(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params
            
            const input = { userId };
            const wallet = await this.getWalletUsecase.getWalletByUserId(input);
            if (!wallet) {
                res.status(404).json({ message: 'Wallet not found' });
                return;
            }
            res.status(200).json(wallet);
        } catch (error) {
            console.error('Error fetching wallet details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}