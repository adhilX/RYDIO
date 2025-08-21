
//=================== Base Admin DTOs ===================

export interface BaseUserOutputDto {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  is_blocked?: boolean;
  is_verified_user?: boolean;
  last_login?: Date;
  vendor_access?: boolean;
  profile_image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//=================== Search User DTOs ===================

export interface SearchUserInputDto {
  search: string;
  page: number;
  limit: number;
}

export interface SearchUserOutputDto {
  users: BaseUserOutputDto[];
  total: number;
}

//=================== Get All Users DTOs ===================

export interface GetAllUsersInputDto {
  page?: number;
  limit?: number;
}

export interface GetAllUsersOutputDto {
  users: BaseUserOutputDto[];
  total: number;
}

//=================== User Management DTOs ===================

export interface BlockUserInputDto {
  userId: string;
}

export interface BlockUserOutputDto {
  success: boolean;
  message: string;
}

export interface UnblockUserInputDto {
  userId: string;
}

export interface UnblockUserOutputDto {
  success: boolean;
  message: string;
}

//=================== Admin Login DTOs ===================

export interface AdminLoginInputDto {
  email: string;
  password: string;
}

export interface AdminLoginOutputDto {
  adminData:{_id: string;
  email: string;
  name: string;
  role: 'admin';},
  accessToken: string,
  refreshToken: string
}

//=================== Vehicle Management DTOs ===================

export interface PendingVehicleInputDto {
  page: number;
  limit: number;
}

export interface PendingVehicleOutputDto {
  vehicle: any[];
  total: number;
}

export interface ApprovedVehicleInputDto {
  search: string;
  page: number;
  limit: number;
}

export interface ApprovedVehicleOutputDto {
  vehicle: any[];
  total: number;
  totalCount: number;
}

export interface VehicleApprovalInputDto {
  id: string;
  action: 'accepted' | 'rejected';
  reason?: string;
}

export interface VehicleApprovalOutputDto {
  success: boolean;
  message: string;
}

//=================== ID Proof Management DTOs ===================

export interface GetIdProofInputDto {
  status: 'pending' | 'approved' | 'rejected';
  currentPage: number;
  itemsPerPage: number;
}

export interface GetIdProofOutputDto {
  idproofs: BaseUserOutputDto[];
  total: number;
}

export interface IdProofActionInputDto {
  idProof_id: string;
  owner_id: string;
  action: 'approved' | 'rejected';
  reason: string;
}

export interface IdProofActionOutputDto {
  success: boolean;
  message: string;
}

//=================== Vendor Access DTOs ===================

export interface VendorAccessInputDto {
  userId: string;
  vendorAccess: boolean;
}

export interface VendorAccessOutputDto {
  success: boolean;
  message: string;
}

//=================== Booking Management DTOs ===================

export interface GetBookingInputDto {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface GetBookingOutputDto {
  bookings: any[];
  total: number;
}

//=================== Wallet Management DTOs ===================

export interface GetAdminWalletOutputDto {
  wallet: {
    _id: string;
    balance: number;
    totalEarnings: number;
    totalWithdrawals: number;
    pendingAmount: number;
  };
}

//=================== Admin Statistics DTOs ===================

export interface AdminStatsOutputDto {
  totalUsers: number;
  totalVehicles: number;
  totalBookings: number;
  activeBookings: number;
  pendingVerifications: number;
  revenue: number;
}
