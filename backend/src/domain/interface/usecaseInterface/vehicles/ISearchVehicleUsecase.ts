import { SearchVehicleInputDto, SearchVehicleOutputDto } from "../../DTOs/userDto/VehicleDto";

export interface ISearchVehicleUsecase {
  searchVehicle(input: SearchVehicleInputDto): Promise<SearchVehicleOutputDto | null>
}
