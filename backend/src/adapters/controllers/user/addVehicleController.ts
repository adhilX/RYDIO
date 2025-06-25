import { Request, Response } from "express";
import { IaddvehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IaddvehicleUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class AddVehicleController {
    private addVehicleUsecase : IaddvehicleUsecase
    constructor(addVehicleUsecase:IaddvehicleUsecase){
        this.addVehicleUsecase = addVehicleUsecase
    }

    async addVehicle(req:Request,res:Response):Promise<void>{
        try {
            const {vehicle} = req.body
           const response= await this.addVehicleUsecase.addVehicle(vehicle)
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