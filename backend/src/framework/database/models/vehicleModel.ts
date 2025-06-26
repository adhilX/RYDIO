import { Document, model, ObjectId } from "mongoose";
import { VehicleSchema } from "../schema/vehicleSchema";
import { IVehicle} from "../../../domain/entities/vehcleEnties";


export interface IVehicleModel extends Omit<IVehicle,'_id'>,Document{
    _id: ObjectId;
}

export const VehicleModel = model<IVehicle>('vehicle',VehicleSchema)