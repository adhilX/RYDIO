export interface CreateUserInputDto {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface CreateUserOutputDto {
  _id: string;
  email: string;
  name: string;
  phone: string;
  idproof_id?: string;
  profile_image?: string;
  role: 'user' | 'admin';
  is_blocked?: boolean;
  is_verified_user?: boolean;
  last_login?: Date;
  vendor_access?: boolean;
  googleVerification?: boolean;
}