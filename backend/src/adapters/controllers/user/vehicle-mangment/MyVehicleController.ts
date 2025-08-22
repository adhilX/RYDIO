import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { ImyVehicleUsecase } from "../../../../domain/interface/usecaseInterface/vehicles/ImyVehicleUsecase";

export class MyVehicleController {
    private _myvehicleUsecase : ImyVehicleUsecase
    constructor(myvehicleUsecase:ImyVehicleUsecase){
        this._myvehicleUsecase = myvehicleUsecase
    }

    async getMyVehicle(req:Request,res:Response):Promise<void>{
        try {
            const{owner_id,search, page, limit} = req.body
            const vehicle = await this._myvehicleUsecase.getMyvehicle({ owner_id, search, page, limit })
            res.status(HttpStatus.OK).json(vehicle)
        } catch (error) {
            console.log('Error while fetching vehicle', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while fetching vehicle",
                error: error instanceof Error ? error.message : 'Unknown error from getMyVehicle controller',
            })
        }
    }
}