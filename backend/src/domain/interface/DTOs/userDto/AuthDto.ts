

// Common Interfaces
interface IVerificationRequest {
  _id?: string;
  idProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//---base user output dto

export interface BaseUserOutputDto {
  _id?: string;
  email: string;
  name: string;
  phone: string;
  idproof_id?: string | IVerificationRequest;
  profile_image?: string;
  role: 'user' | 'admin';
  is_blocked?: boolean;
  is_verified_user?: boolean;
  last_login?: Date;
  vendor_access?: boolean;
  googleVerification?: boolean;
}

//======================================================================


//---login user dto
export interface LoginUserInputDto {
  email: string;
  password: string;
}

export interface LoginUserOutputDto extends BaseUserOutputDto {}

//---create user dto
export interface CreateUserInputDto {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface CreateUserOutputDto extends BaseUserOutputDto {
  _id: string; // Required for create user
}

//---refresh token dto
export interface RefreshTokenInputDto {
  token: string;
}

export interface RefreshTokenOutputDto {
  accessToken: string;
}

//---get user dto
export interface GetUserInputDto {
  userId: string;
}

export interface GetUserOutputDto extends BaseUserOutputDto {}

//---change password dto
export interface ChangePasswordInputDto {
  email: string;
  newPassword: string;
}

export interface ChangePasswordOutputDto extends BaseUserOutputDto {}

//---google login dto
export interface GoogleLoginInputDto {
  email: string;
  name: string;
  profile_image?: string;
  googleVerification: boolean;
}

export interface GoogleLoginOutputDto extends BaseUserOutputDto {}

//---logout dto
export interface LogoutUserInputDto {
  token: string;
}

export interface LogoutUserOutputDto {
  success: boolean;
  message: string;
}

//---forgot password dto
export interface SendForgotPasswordOtpInputDto {
  email: string;
}

export interface SendForgotPasswordOtpOutputDto {
  success: boolean;
  message: string;
}

//---verify forgot password otp dto
export interface VerifyForgotPasswordOtpInputDto {
  email: string;
  otp: string;
}

export interface VerifyForgotPasswordOtpOutputDto {
  success: boolean;
  message: string;
  isValid: boolean;
}

//---edit profile dto
export interface EditProfileInputDto {
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
}

export interface EditProfileOutputDto extends BaseUserOutputDto {}
