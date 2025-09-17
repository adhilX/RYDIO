export interface IReapplyVehicleUsecase {
    reapplyVehicle(vehicleId: string): Promise<{ success: boolean; message: string }>;
}