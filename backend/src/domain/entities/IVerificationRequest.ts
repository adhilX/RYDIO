import { ObjectId } from "mongoose";

export interface IVerificationRequest {
  _id?: ObjectId; 
  idProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
