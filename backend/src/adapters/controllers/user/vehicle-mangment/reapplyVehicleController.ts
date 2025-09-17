import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IReapplyVehicleUsecase } from "../../../../domain/interface/usecaseInterface/vehicles/IReapplyVehiclUsecase";

export class ReapplyVehicleController {

    constructor( private _reapplyVehicleUsecase: IReapplyVehicleUsecase ) {
    }

    async reapplyVehicle(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId } = req.body;

            if (!vehicleId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Vehicle ID is required"
                });
                return;
            }

            const result = await this._reapplyVehicleUsecase.reapplyVehicle(vehicleId);
                res.status(HttpStatus.OK).json(result);
            
        } catch (error) {
            console.error("Error in reapplyVehicle controller:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}
