import type { IidProof_id } from "./IidProof";

export interface Iuser {
  _id: string; 
  idproof_id?: IidProof_id;
  name: string;
  email: string;
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
