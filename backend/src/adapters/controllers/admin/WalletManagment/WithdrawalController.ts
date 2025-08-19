import { Request, Response } from "express";
import { IWithdrawalUsecase } from "../../../../domain/interface/usecaseInterface/user/wallet/IuserWithdrawalUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class UserWithdrawalController {
    constructor(private _WithdrawalUsecase:IWithdrawalUsecase){}

    async withdrawal(req:Request, res:Response):Promise<void> {
        const { userId, amount, accountDetails } = req.body;
        try {
            const input = {
                userId,
                amount,
                accountDetails
            };
            
            const result = await this._WithdrawalUsecase.userWithdrawal(input);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Withdrawal request failed", error });
        }
    }
}