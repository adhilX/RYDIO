import { BookingStatus, PaymentStatus, PaymentType } from "../../../entities/BookingEntities";
import { Location } from "../../../entities/LocationEnties";
import { User } from "../../../entities/userEntities";
import { IVehicle } from "../../../entities/vehcleEnties";
import { IVerificationRequest } from "../../../entities/VerificationRequest";

// Base Booking DTO for shared booking properties
export interface BaseBookingDto {
  _id?: string;
  booking_id: string;
  user_id: string;
  vehicle_id: string;
  address: string;
  city: string;
  start_date: Date;
  end_date: Date;
  total_amount: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_type: PaymentType;
}

export interface BaseInputDto {
  user_id: string;
  page: number;
  limit: number;
  search:string
  status:BookingStatus
}


export interface BaseOutputDto {
  bookings: CreateBookingOutputDto[];
  total: number;
}

//============================================

// Note: CreateBookingInputDto removed - using original BookingData pattern

export interface CreateBookingOutputDto extends BaseBookingDto {
  ride_start_time?: Date;
  ride_end_time?: Date;
  finance: {
    security_deposit: number;
    fine_amount: number;
    admin_commission: number;
    owner_earnings: number;
    is_late_return: boolean;
    user_withdraw: boolean;
    owner_withdraw: boolean;
  };
  payment_intent_id?: string;
  cancellation_reason?: string;
}

// My Booking DTOs
export interface MyBookingInputDto extends BaseInputDto{}

export interface MyBookingItemDto extends Omit<CreateBookingOutputDto, 'vehicle_id'> {
  vehicle: IVehicle;
  location?:Location
  name?: string;
  phone?: number;
  createdAt?: Date;
}

export interface MyBookingOutputDto {
  bookings: MyBookingItemDto[];
  total: number;
}

// Incoming Booking DTOs
export interface IncomingBookingInputDto extends Omit<BaseInputDto ,'user_id'> {
  owner_id: string;
}

export interface IncomingBookingOutputDto extends BaseOutputDto{}


// Cancel Booking DTOs
export interface CancelBookingInputDto {
  booking_id: string;
  cancellation_reason: string;
}

export interface CancelBookingOutputDto {
  success: boolean;
  message: string;
  refund_amount?: number;
}

export interface GetSecurityDepositOutputDto {
  security_deposit: number;
}
