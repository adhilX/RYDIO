import { Request, Response } from "express"
import { IrideStartUsecase } from "../../../../domain/interface/usecaseInterface/bookings/IrideStartUsecase"
import { HttpStatus } from "../../../../domain/entities/httpStatus"

export class RideStartController {
    constructor(private _rideStartUsecase: IrideStartUsecase) { }
    async handleRideStart(req: Request, res: Response) {
        try {
            const { bookingId } = req.params
            const scanner_user_id = (req as any).user?.userId

            if (!scanner_user_id) {
                return res.status(401).json({ message: "User authentication required" });
            }
            const input = { bookingId };
            const result = await this._rideStartUsecase.rideStart(input, scanner_user_id)
            res.json({ message: "Ride started successfully", result })
        } catch (error) {
            console.log('error while ride start', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while ride start',
                error: error instanceof Error ? error.message : 'error while ride start'
            })
        }
    }
}
