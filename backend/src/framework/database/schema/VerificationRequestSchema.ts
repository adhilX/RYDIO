
import { Schema } from "mongoose";
import { IVerificationRequestModel } from "../models/verificationRequestModel";

export const verificationRequestSchema = new Schema<IVerificationRequestModel>(
  {
    idProofUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
  },
    reason: {
      type: String,
      default: "", 
    },
  },
  {
    timestamps: true,
  }
);

