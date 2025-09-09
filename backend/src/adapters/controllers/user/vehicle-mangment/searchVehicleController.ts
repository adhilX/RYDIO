import { Request, Response } from "express";
import { ISearchVehicleUsecase } from "../../../../domain/interface/usecaseInterface/vehicles/ISearchVehicleUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class SearchVehicleController {

    constructor(private _searchVehicleUsecase:ISearchVehicleUsecase){
        this._searchVehicleUsecase=_searchVehicleUsecase
    }
  
async searchVehicle(req: Request, res: Response): Promise<void> {
  try {
    const { latitude, longitude,pickupDate,returnDate, currentPage, limit,user_id, filters } = req.body;
    const { search, fuel_types, seats, car_types, transmission ,distance_range} = filters || {};

    const vehicles = await this._searchVehicleUsecase.searchVehicle({
      lat:latitude,
      lon:longitude,
      search,
      pickupDate,
      returnDate,
      currentPage,
      limit,
      user_id,
      filters: {
        fuel_types,
        seats,
        car_types,
        transmission,
        distance_range
      }
    });
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