
import { Schema, model, Types } from "mongoose";
import { IVerificationRequestModel } from "../models/verificationRequestModel";

export const verificationRequestSchema = new Schema<IVerificationRequestModel>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
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

