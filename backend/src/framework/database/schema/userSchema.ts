import { Schema } from "mongoose";
import { User } from "../../../domain/entities/userEntities";

export const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: { type: String, required: false },
  role: { type: String, enum: ['user', 'admin'], required: true },
  profile_image: { type: String, default: "" },
  is_blocked: { type: Boolean, default: false },
  vendor_access: { type: Boolean, default: true },
  is_verified_user: { type: Boolean, default: false },
  last_login: { type: Date, default: new Date() },
  googleVerification: { type: Boolean, default: false }
}, { timestamps: true });
