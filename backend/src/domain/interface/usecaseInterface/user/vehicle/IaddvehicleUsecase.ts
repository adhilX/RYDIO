import { Location } from "../../../../entities/LocationEnties";
import { IVehicle } from "../../../../entities/vehcleEnties";
interface AddVehicleProps {
  vehicle: Omit<IVehicle, 'location_id'>;
  location: Location
}
export interface IaddvehicleUsecase {

    addVehicle({ vehicle, location }: AddVehicleProps): Promise<IVehicle>
}