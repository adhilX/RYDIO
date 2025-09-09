import { SearchVehicleInputDto, SearchVehicleOutputDto } from "../../DTOs/userDto/VehicleDto";

export interface ISearchVehicleUsecase {
  searchVehicle({ lat, lon, search, pickupDate, returnDate, currentPage, limit, user_id, filters }: SearchVehicleInputDto): Promise<SearchVehicleOutputDto | null>
}
