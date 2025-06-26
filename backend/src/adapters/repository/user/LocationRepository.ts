import { Location } from "../../../domain/entities/LocationEnties";
import { ILocationRepository } from "../../../domain/interface/repositoryInterface/IlocationRepository";
import { locationModel } from "../../../framework/database/models/locationModel";

export class LocationRepository implements ILocationRepository {
  async findOrCreate(location: Location): Promise<Location> {
    const existing = await locationModel.findOne({
      name: location.name,
      city: location.city,
      pincode: location.pincode,
    });

    if (existing) return existing.toObject();

    const newLocation = new locationModel(location);
    await newLocation.save();
    return newLocation.toObject();
  }
}