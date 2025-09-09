import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IGetWalletUsecase } from "../../../domain/interface/usecaseInterface/wallets/IGetWalletUsecase";

export class GetWalletController{
    constructor(private getWalletUsecase: IGetWalletUsecase) {
        this.getWalletUsecase = getWalletUsecase;
    }

    async getWalletDetails(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params
            
            const input = { userId };
            const wallet = await this.getWalletUsecase.getWalletByUserId(input);
            if (!wallet) {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'Wallet not found' });
                return;
            }
            res.status(HttpStatus.OK).json(wallet);
        } catch (error) {
            console.error('Error fetching wallet details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}