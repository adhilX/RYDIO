// User Profile DTOs

//=================== Change Password DTOs ===================

export interface ChangePasswordInputDto {
  _id: string;
  current: string;
  newPass: string;
  confirm: string;
}

export interface ChangePasswordOutputDto {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//=================== Edit Profile DTOs ===================

export interface EditProfileInputDto {
  userId: string;
  profileData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export interface EditProfileOutputDto {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//=================== Upload ID Proof DTOs ===================

export interface UploadIdProofInputDto {
  userId: string;
  imageUrl: string;
}

export interface UploadIdProofOutputDto {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  idProofUrl?: string;
  verificationStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//=================== Get User Profile DTOs ===================

export interface GetUserProfileInputDto {
  userId: string;
}

export interface GetUserProfileOutputDto {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  idProofUrl?: string;
  verificationStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
