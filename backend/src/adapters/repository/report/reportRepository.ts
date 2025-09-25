import { reportModel } from "../../../framework/database/models/reportModel";
import { Report } from "../../../domain/entities/ReportEntities";
import { IReportRepository } from "../../../domain/interface/repositoryInterface/IReportRepository";
import { BaseRepository } from "../base/BaseRepo";

export class ReportRepository extends BaseRepository<Report> implements IReportRepository {
    constructor() {
        super(reportModel);
    }

    async findReportsByReporter(reporterId: string): Promise<Report[]> {
        return await reportModel.find({ reporterId }).sort({ createdAt: -1 });
    }


    async findReportsByBooking(bookingId: string): Promise<Report[]> {
        return await reportModel.find({ bookingId }).sort({ createdAt: -1 });
    }

    async updateReportStatus(id: string, status: string): Promise<Report | null> {
        const updatedReport = await reportModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        return updatedReport;
    }

    async getAllReports(): Promise<Report[]> {
        return await reportModel.find().sort({ createdAt: -1 });
    }

    async getAllReportsWithFilters(filters: { status?: string;search?: string;dateFrom?: string;dateTo?: string;page: number;limit: number;}): Promise<{
        reports: Report[]; total: number;currentPage: number;totalPages: number;}> {
        interface ReportQuery {
            status?: string;
            createdAt?: {
                $gte?: Date;
                $lte?: Date;
            };
            $or?: Array<{
                reason?: { $regex: string; $options: string };
                bookingId?: { $regex: string; $options: string };
            }>;
        }

        const query: ReportQuery = {};

        // Status filter
        if (filters.status) {
            query.status = filters.status;
        }

        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
            query.createdAt = {};
            if (filters.dateFrom) {
                query.createdAt.$gte = new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                query.createdAt.$lte = new Date(filters.dateTo);
            }
        }

        // Search filter (search in reason field)
        if (filters.search) {
            query.$or = [
                { reason: { $regex: filters.search, $options: 'i' } },
                { bookingId: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const skip = (filters.page - 1) * filters.limit;
        const total = await reportModel.countDocuments(query);
        const totalPages = Math.ceil(total / filters.limit);

        const reports = await reportModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(filters.limit);

        return {
            reports: reports.map(report => report.toObject()),
            total,
            currentPage: filters.page,
            totalPages
        };
    }

    async getReportsStats(): Promise<{total: number;pending: number;inReview: number;resolved: number;dismissed: number}> {
        const [total, pending, inReview, resolved, dismissed] = await Promise.all([
            reportModel.countDocuments(),
            reportModel.countDocuments({ status: 'Pending' }),
            reportModel.countDocuments({ status: 'In Review' }),
            reportModel.countDocuments({ status: 'Resolved' }),
            reportModel.countDocuments({ status: 'Dismissed' })
        ]);

        return {
            total,
            pending,
            inReview,
            resolved,
            dismissed
        };
    }

    async findReportById(id: string): Promise<Report | null> {
         return await reportModel.findById(id)
    }
}
