
export interface LoginUserInputDto {
  email: string;
  password: string;
}

 interface IVerificationRequest {
  _id?: string;
  idProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginUserOutputDto {
        _id?: string;
        email: string;
        name: string;
        phone: string;
        idproof_id?: string | IVerificationRequest;
        profile_image?: string;
        role: 'admin'|'user';
        is_blocked?: boolean;
        is_verified_user?: boolean;
        last_login?: Date;
        vendor_access?: boolean;
        googleVerification?: boolean;
}