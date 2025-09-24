import { ReportStatus } from "../../../entities/ReportEntities";

export interface ICreateReportInputDto {
    reporterId: string;
    bookingId: string;
    ownerId: string;
    reason: string;
}

export interface ICreateReportOutputDto {
    _id: string;
    reporterId: string;
    bookingId: string;
    reason: string;
    status: ReportStatus;
    createdAt: Date;
}

export interface IUpdateReportStatusInputDto {
    reportId: string;
    status: ReportStatus;
}

export interface IGetReportsOutputDto {
    reports: ICreateReportOutputDto[];
    total: number;
}

export interface IGetReportsWithFiltersInputDto {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    limit: number;
}

export interface IUserProfileDto {
    _id?: string;
    name: string;
    email: string;
    profile_image?: string;
}

export interface IVehicleDto {
    _id?: string;
    name: string;
    image?: string;
}

export interface IBookingDto {
    _id?: string;
    booking_id: string;
    vehicle?: IVehicleDto | null;
}

export interface IEnrichedReportDto {
    _id: string;
    reporterId: string;
    bookingId: string;
    reason: string;
    status: ReportStatus;
    createdAt: Date;
    updatedAt?: Date;
    reporter?: IUserProfileDto | null;
    owner?: IUserProfileDto | null;
    booking?: IBookingDto | null;
}

export interface IGetReportsWithFiltersOutputDto {
    reports: IEnrichedReportDto[];
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface IGetReportsStatsOutputDto {
    total: number;
    pending: number;
    inReview: number;
    resolved: number;
    dismissed: number;
}

export interface IGetReportByIdInputDto {
    reportId: string;
}

export interface IGetReportByIdOutputDto {
    report: IEnrichedReportDto | null;
}

export interface IUpdateReportStatusInputDto {
    reportId: string;
    status: ReportStatus;
}

export interface IUpdateReportStatusOutputDto {
    report: ICreateReportOutputDto | null;
}
