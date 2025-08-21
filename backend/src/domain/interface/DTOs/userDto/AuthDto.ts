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

export interface LoginUserOutputDto {
  createdUser: BaseUserOutputDto;
  accessToken: string;
  refreshToken: string;
}

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

//---get user dto
export interface GetUserInputDto {
  userId: string;
}

export type GetUserOutputDto = BaseUserOutputDto;

//---change password dto
export interface ChangePasswordInputDto {
  email: string;
  newPassword: string;
}

export type ChangePasswordOutputDto = BaseUserOutputDto 

//---google login dto
export interface GoogleLoginInputDto {
  email: string;
  name: string;
  profile_image?: string;
  googleVerification: boolean;
}

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

export type EditProfileOutputDto = BaseUserOutputDto;
