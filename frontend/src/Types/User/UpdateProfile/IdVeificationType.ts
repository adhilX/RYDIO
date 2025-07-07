export type IVerificationRequest={
  _id?: string    ; 
  idProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}