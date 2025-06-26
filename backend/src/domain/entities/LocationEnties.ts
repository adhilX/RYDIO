import { ObjectId } from "mongoose";

export interface Location {
  _id?:ObjectId;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}
