import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IWithdrawUsecase } from "../../../../domain/interface/usecaseInterface/wallets/IWithdrawUsecase";

export class WithdrawController {
    
    constructor(private _withdrawUsecase: IWithdrawUsecase) {}

    async withdraw(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.params;
            const { userId } = req.body;
            
            const result = await this._withdrawUsecase.withdraw({ bookingId, userId });
            
            if (result) {
                res.status(HttpStatus.OK).json({
                    message: 'Withdrawal completed successfully',
                    success: true
                });
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Withdrawal failed',
                    success: false
                });
            }
        } catch (error) {
            console.log('Error during withdrawal:', error);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Error during withdrawal',
                error: error instanceof Error ? error.message : 'Unknown withdrawal error'
            });
        }
    }
}