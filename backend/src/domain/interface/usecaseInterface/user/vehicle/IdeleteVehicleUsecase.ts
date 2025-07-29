export interface IdeleteVehicleUsecase {
    execute(vehicleId:string):Promise<boolean>;
}