
import { Document, model, ObjectId } from "mongoose";
import { IVerificationRequest } from "../../../domain/entities/IVerificationRequest";
import { verificationRequestSchema } from "../schema/VerificationRequestSchema";

export interface IVerificationRequestModel extends Omit<IVerificationRequest, '_id'>, Document {
  _id: ObjectId;
}

export const verificationRequestModel = model<IVerificationRequestModel>('VerificationRequest', verificationRequestSchema);
