import { Request, Response } from "express";
import { IAddVehicleUsecase } from "../../../../domain/interface/usecaseInterface/vehicles/IAddVehicleUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class AddVehicleController {
    private _addVehicleUsecase : IAddVehicleUsecase
    constructor(addVehicleUsecase:IAddVehicleUsecase){
        this._addVehicleUsecase = addVehicleUsecase
    }

    async addVehicle(req:Request,res:Response):Promise<void>{
        try {
            const {vehicle,location} = req.body
           await this._addVehicleUsecase.addVehicle({vehicle,location})
            res.status(HttpStatus.CREATED).json({message:'vehicle added'})
        } catch (error) {
              console.log('error while adding vehicle', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while adding vehicle",
                error: error instanceof Error ? error.message : 'Unknown error from add vehicle controller',
            })
        }
    }
}