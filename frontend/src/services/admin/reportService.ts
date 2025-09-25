import { adminAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export interface AdminReportData {
  _id: string;
  reporterId: string;
  bookingId: string;
  reason: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Dismissed';
  createdAt: string;
  updatedAt: string;
  // Populated fields from backend
  reporter?: {
    _id: string;
    name: string;
    email: string;
    profile_image: string;
  };
  owner?: {
    _id: string;
    name: string;
    email: string;
    profile_image: string;
  };
  booking?: {
    _id: string;
    booking_id: string;
    vehicle: {
      _id: string;
      name: string;
      image: string | null;
    } | null;
  };
}

export interface ReportsListResponse {
  reports: AdminReportData[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ReportFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getAllReports = async (filters: ReportFilters = {}): Promise<ReportsListResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get(`/admin/reports/all?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while fetching reports');
  }
};

export const updateReportStatus = async (reportId: string, status: string): Promise<AdminReportData> => {
  try {
    const response = await axiosInstance.patch(`/admin/reports/${reportId}/status`, { status });
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while updating report status');
  }
};

export const getReportById = async (reportId: string): Promise<AdminReportData> => {
  try {
    const response = await axiosInstance.get(`/admin/reports/${reportId}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while fetching report details');
  }
};

export const getReportsStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/reports/stats');
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while fetching report statistics');
  }
};
