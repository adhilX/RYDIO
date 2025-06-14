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
  created_at?: Date;
}
