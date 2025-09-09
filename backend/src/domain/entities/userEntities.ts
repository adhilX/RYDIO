import { IVerificationRequest } from './VerificationRequest';

export interface User {
  _id?: string; 
  idproof_id?:string|IVerificationRequest;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user'| 'admin';
  profile_image?: string;
  is_blocked?: boolean;
  vendor_access?: boolean;
  is_verified_user?:boolean 
  last_login?: Date;
  createdAt?: Date;
  updatedAt?:Date
  googleVerification?:boolean
}
