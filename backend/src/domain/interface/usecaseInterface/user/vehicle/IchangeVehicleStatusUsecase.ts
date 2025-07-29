export interface IchangeVehicleStatusUsecase {
    execute(vehicleId:string):Promise<boolean>
}