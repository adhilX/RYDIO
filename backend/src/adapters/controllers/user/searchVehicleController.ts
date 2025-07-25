import { Request, Response } from "express";
import { IsearchVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IsearchVehicleUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class SearchVehicleController {

    constructor(private searchVehicleUsecase:IsearchVehicleUsecase){
        this.searchVehicleUsecase=searchVehicleUsecase
    }
  
async searchVehicle(req: Request, res: Response): Promise<void> {
  try {
    const { latitude, longitude, currentPage, limit, filters } = req.body;
    const { search, fuel_types, seats, car_types, transmission } = filters || {};

    const vehicles = await this.searchVehicleUsecase.searchVehicle(
      latitude,
      longitude,
      search,
      currentPage,
      limit,
      {
        fuel_types,
        seats,
        car_types,
        transmission
      }
    );

    res.status(HttpStatus.OK).json(vehicles);

  } catch (error) {
    console.error('Error while searching vehicles:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while searching vehicle",
      error: error instanceof Error ? error.message : 'Unknown error from searchVehicle controller',
    });
  }
}

}