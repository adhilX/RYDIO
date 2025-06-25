import {ObjectId} from 'mongoose'

export interface User {
  _id?: ObjectId; 
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
  created_at?: Date;
  googleVerification?:boolean
}
