import { Schema } from "mongoose";
import { ClientEnties } from "../../../domain/entities/clientEnties";

export const userSchema = new Schema<ClientEnties>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  profile_image: { type: String, default: "" },
  is_blocked: { type: Boolean, default: false },
  vendor_access: { type: Boolean, default: true },

},{timestamps:true});
