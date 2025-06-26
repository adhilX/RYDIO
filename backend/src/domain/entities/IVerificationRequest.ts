import { ObjectId } from "mongoose";

export interface IVerificationRequest {
  _id?: ObjectId; 
  userId: ObjectId; 
  idProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
