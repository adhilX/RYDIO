export interface IGetBookedVehicleUsecase {
  execute(userId: string): Promise<string[]|null>;
}