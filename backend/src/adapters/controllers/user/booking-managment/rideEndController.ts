import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IRideEndUsecase } from "../../../../domain/interface/usecaseInterface/user/booking/IRideEndUsecase";
import { Request, Response } from "express";

export class RideEndController {
    constructor(private _rideEndUsecase: IRideEndUsecase) {}


    async handleRideEnd(req:Request,res:Response){
        try {
            const {bookingId} = req.params
            const scanner_user_id = (req as any).user?.userId

            if (!scanner_user_id) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User authentication required" });
            }
            const input = { bookingId };
            const result = await this._rideEndUsecase.execute(input, scanner_user_id)
            res.status(HttpStatus.OK).json({message:"Ride ended successfully",result})
        } catch (error) {
            console.log('error while ride end',error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while ride end',
                error: error instanceof Error ? error.message : 'error while ride end'
            })
        }
    }
}