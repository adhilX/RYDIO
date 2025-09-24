import { IGetReportsOutputDto, IGetReportsWithFiltersInputDto, IGetReportsWithFiltersOutputDto, IGetReportsStatsOutputDto, IGetReportByIdInputDto, IGetReportByIdOutputDto, IUpdateReportStatusInputDto, IUpdateReportStatusOutputDto } from "../../domain/interface/DTOs/reportDto/reportDto";
import { IReportRepository } from "../../domain/interface/repositoryInterface/IReportRepository";
import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";
import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IGetReportsUsecase } from "../../domain/interface/usecaseInterface/report/IGetReportsUsecase";

export class GetReportsUsecase implements IGetReportsUsecase {
    constructor(private _reportRepository: IReportRepository,private _userRepository: IUserRepository,private _bookingRepository: IBookingRepository,private _vehicleRepository: IVehicleRepository){}

    async getReportsByUser(userId: string): Promise<IGetReportsOutputDto> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const reports = await this._reportRepository.findReportsByReporter(userId);
        
        return {
            reports: reports.map(report => ({
                _id: report._id!,
                reporterId: report.reporterId,
                bookingId: report.bookingId,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt!
            })),
            total: reports.length
        };
    }


    async getReportsByBooking(bookingId: string): Promise<IGetReportsOutputDto> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const reports = await this._reportRepository.findReportsByBooking(bookingId);
        
        return {
            reports: reports.map(report => ({
                _id: report._id!,
                reporterId: report.reporterId,
                bookingId: report.bookingId,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt!
            })),
            total: reports.length
        };
    }

    async getAllReportsWithFilters(filters: IGetReportsWithFiltersInputDto): Promise<IGetReportsWithFiltersOutputDto> {

        const result = await this._reportRepository.getAllReportsWithFilters(filters);
        
        // Fetch user data for reporters and owners, plus booking and vehicle data
        const enrichedReports = await Promise.all(
            result.reports.map(async (report) => {
                const [reporter, booking] = await Promise.all([
                    this._userRepository.findById(report.reporterId),
                    this._bookingRepository.findByBookingId(report.bookingId)
                ]);

                let owner = null;
                let vehicle = null;

                if (booking) {
                    // Get vehicle data
                    const vehicleId = typeof booking.vehicle_id === 'string' ? booking.vehicle_id : booking.vehicle_id.toString();
                    vehicle = await this._vehicleRepository.getVehicle(vehicleId);
                    
                    // Get owner data from vehicle
                    if (vehicle && vehicle.owner_id) {
                        const ownerId = typeof vehicle.owner_id === 'string' ? vehicle.owner_id : vehicle.owner_id.toString();
                        owner = await this._userRepository.findById(ownerId);
                    }
                }

                return {
                    _id: report._id!,
                    reporterId: report.reporterId,
                    bookingId: report.bookingId,
                    reason: report.reason,
                    status: report.status,
                    createdAt: report.createdAt!,
                    updatedAt: report.updatedAt,
                    reporter: reporter ? {
                        _id: reporter._id,
                        name: reporter.name,
                        email: reporter.email,
                        profile_image: reporter.profile_image
                    } : null,
                    owner: owner ? {
                        _id: owner._id,
                        name: owner.name,
                        email: owner.email,
                        profile_image: owner.profile_image
                    } : null,
                    booking: booking ? {
                        _id: booking._id,
                        booking_id: booking.booking_id,
                        vehicle: vehicle ? {
                            _id: vehicle._id,
                            name: vehicle.name,
                            image: vehicle.image_urls && vehicle.image_urls.length > 0 ? vehicle.image_urls[0] : undefined
                        } : null
                    } : null
                };
            })
        );
        
        return {
            reports: enrichedReports,
            total: result.total,
            currentPage: result.currentPage,
            totalPages: result.totalPages
        };
    }

    async getReportsStats(): Promise<IGetReportsStatsOutputDto> {
        return await this._reportRepository.getReportsStats();
    }

    async getReportById(input: IGetReportByIdInputDto): Promise<IGetReportByIdOutputDto> {
        if (!input.reportId) {
            throw new Error('Report ID is required');
        }

        const report = await this._reportRepository.findReportById(input.reportId);
        
        if (!report) {
            return { report: null };
        }

        // Fetch user data for reporter and owner, plus booking and vehicle data
        const [reporter, booking] = await Promise.all([
            this._userRepository.findById(report.reporterId),
            this._bookingRepository.findByBookingId(report.bookingId)
        ]);

        let owner = null;
        let vehicle = null;

        if (booking) {
            // Get vehicle data
            const vehicleId = typeof booking.vehicle_id === 'string' ? booking.vehicle_id : booking.vehicle_id.toString();
            vehicle = await this._vehicleRepository.getVehicle(vehicleId);
            
            // Get owner data from vehicle
            if (vehicle && vehicle.owner_id) {
                const ownerId = typeof vehicle.owner_id === 'string' ? vehicle.owner_id : vehicle.owner_id.toString();
                owner = await this._userRepository.findById(ownerId);
            }
        }

        return {
            report: {
                _id: report._id!,
                reporterId: report.reporterId,
                bookingId: report.bookingId,
                reason: report.reason,
                status: report.status,
                createdAt: report.createdAt!,
                updatedAt: report.updatedAt,
                reporter: reporter ? {
                    _id: reporter._id,
                    name: reporter.name,
                    email: reporter.email,
                    profile_image: reporter.profile_image
                } : null,
                owner: owner ? {
                    _id: owner._id,
                    name: owner.name,
                    email: owner.email,
                    profile_image: owner.profile_image
                } : null,
                booking: booking ? {
                    _id: booking._id,
                    booking_id: booking.booking_id,
                    vehicle: vehicle ? {
                        _id: vehicle._id,
                        name: vehicle.name,
                        image: vehicle.image_urls && vehicle.image_urls.length > 0 ? vehicle.image_urls[0] : undefined
                    } : null
                } : null
            }
        };
    }

    async updateReportStatus(input: IUpdateReportStatusInputDto): Promise<IUpdateReportStatusOutputDto> {
        if (!input.reportId || !input.status) {
            throw new Error('Report ID and status are required');
        }

        const updatedReport = await this._reportRepository.updateReportStatus(input.reportId, input.status);
        
        if (!updatedReport) {
            return { report: null };
        }

        return {
            report: {
                _id: updatedReport._id!,
                reporterId: updatedReport.reporterId,
                bookingId: updatedReport.bookingId,
                reason: updatedReport.reason,
                status: updatedReport.status,
                createdAt: updatedReport.createdAt!
            }
        };
    }
}
