import { Request, Response } from "express";
import { IGetBookedVehicleUsecase } from "../../../../domain/interface/usecaseInterface/user/booking/IGetBookedVehicleUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class GetBookedVehicleController {
    private _getBookedVehicleUsecase: IGetBookedVehicleUsecase;

    constructor(getBookedVehicleUsecase: IGetBookedVehicleUsecase) {
        this._getBookedVehicleUsecase = getBookedVehicleUsecase;
    }
    async getBookedVehicleDetails(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId } = req.params;
            const bookedVehicles = await this._getBookedVehicleUsecase.execute({vehicleId});
            res.status(HttpStatus.OK).json(bookedVehicles);
        } catch (error) {
            console.error('Error while fetching booked vehicles', error);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while fetching booked vehicles",
                error: error instanceof Error ? error.message : 'Unknown error from GetBookedVehicleController',
            });
        }
    }
}