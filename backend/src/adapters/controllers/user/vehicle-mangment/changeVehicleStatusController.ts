import { Request, Response } from "express";
import { IchangeVehicleStatusUsecase } from "../../../../domain/interface/usecaseInterface/vehicles/IchangeVehicleStatusUsecase";

export class ChangeVehicleStatusController {
    private _changeVehicleStatusUsecase: IchangeVehicleStatusUsecase;
    constructor(changeVehicleStatusUsecase: IchangeVehicleStatusUsecase) {
      this._changeVehicleStatusUsecase = changeVehicleStatusUsecase
    }
    async changeVehicleStatus(req:Request,res:Response){
        try {
            const {vehicleId} = req.params;
            await this._changeVehicleStatusUsecase.execute({ vehicleId });
            res.status(200).json({message:'vehicle status changed successfully',success:true});
        } catch (error) {
            console.log('error while changing vehicle status',error)
            res.status(400).json({
                message:'error while changing vehicle status',
                error:error instanceof Error ? error.message : 'error while changing vehicle status',
                success:false
            })
        }
    }
}