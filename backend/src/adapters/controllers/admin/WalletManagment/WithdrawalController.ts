import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

// TODO: Withdrawal interface was removed - this controller needs to be updated or removed
export class UserWithdrawalController {
    constructor(){}

    async withdrawal(req:Request, res:Response):Promise<void> {
        try {
            // TODO: Implement withdrawal logic with correct interface
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Withdrawal functionality not implemented" });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Withdrawal request failed", error });
        }
    }
}