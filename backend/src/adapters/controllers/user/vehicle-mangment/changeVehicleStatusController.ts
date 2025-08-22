import { Request, Response } from "express";
import { IchangeVehicleStatusUsecase } from "../../../../domain/interface/usecaseInterface/user/vehicle/IchangeVehicleStatusUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class ChangeVehicleStatusController {
    private _changeVehicleStatusUsecase: IchangeVehicleStatusUsecase;
    constructor(changeVehicleStatusUsecase: IchangeVehicleStatusUsecase) {
      this._changeVehicleStatusUsecase = changeVehicleStatusUsecase
    }
    async changeVehicleStatus(req:Request,res:Response){
        try {
            const {vehicleId} = req.params;
            await this._changeVehicleStatusUsecase.execute({ vehicleId });
            res.status(HttpStatus.OK).json({message:'vehicle status changed successfully',success:true});
        } catch (error) {   
            console.log('error while changing vehicle status',error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message:'error while changing vehicle status',
                error:error instanceof Error ? error.message : 'error while changing vehicle status',
                success:false
            })
        }
    }
}