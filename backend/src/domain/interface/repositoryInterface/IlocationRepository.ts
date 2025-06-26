import { Location } from "../../entities/LocationEnties";

export interface ILocationRepository {
  findOrCreate(location: Location): Promise<Location>;
}
