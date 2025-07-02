import { Location } from "../../../domain/entities/LocationEnties";
import { ILocationRepository } from "../../../domain/interface/repositoryInterface/IlocationRepository";
import { locationModel } from "../../../framework/database/models/locationModel";

export class LocationRepository implements ILocationRepository {
  async findOrCreate(location: Location): Promise<Location> {
    const latitude = parseFloat(location.latitude as string);
    const longitude = parseFloat(location.longitude as string);

    const existing = await locationModel.findOne({
      name: location.name,
      city: location.city,
      pincode: location.pincode,
      'location.coordinates': [longitude, latitude],
    });

    if (existing) return existing.toObject();

    const newLocation = new locationModel({
      ...location,
      latitude,
      longitude,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    await newLocation.save();
    return newLocation.toObject();
  }
}
