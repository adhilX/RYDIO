import { Report } from "../../entities/ReportEntities";
import { IBaseRepository } from "./IbaseRepo";

export interface IReportRepository extends IBaseRepository<Report> {
    findReportsByReporter(reporterId: string): Promise<Report[]>;
    findReportsByBooking(bookingId: string): Promise<Report[]>;
    updateReportStatus(id: string, status: string): Promise<Report | null>;
    getAllReports(): Promise<Report[]>;
    getAllReportsWithFilters(filters: {
        status?: string;
        search?: string;
        dateFrom?: string;
        dateTo?: string;
        page: number;
        limit: number;
    }): Promise<{
        reports: Report[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    getReportsStats(): Promise<{
        total: number;
        pending: number;
        inReview: number;
        resolved: number;
        dismissed: number;
    }>;
    findReportById(id: string): Promise<Report | null>;
}
