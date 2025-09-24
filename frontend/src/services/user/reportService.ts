import { userAxios as axiosInstance } from "@/axios/interceptors";
import { isAxiosError } from "axios";

export interface CreateReportData {
  reporterId: string;
  bookingId: string;
  ownerId: string;
  reason: string;
}

export interface ReportResponse {
  _id: string;
  reporterId: string;
  bookingId: string;
  reason: string;
  status: string;
  createdAt: string;
}

export const createReport = async (reportData: CreateReportData): Promise<ReportResponse> => {
  console.log(reportData)
  try {
    const response = await axiosInstance.post('/reports/create', reportData);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while creating report');
  }
};

export const getReportsByUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/reports/user/${userId}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while fetching reports');
  }
};

export const getReportsByBooking = async (bookingId: string) => {
  try {
    const response = await axiosInstance.get(`/reports/booking/${bookingId}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
    throw new Error('Unexpected error while fetching booking reports');
  }
};

export const checkIfUserReportedBooking = async (bookingId: string, userId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/reports/booking/${bookingId}`);
    const reports = response.data.data.reports || [];
    
    // Check if the current user has already reported this booking
    return reports.some((report: any) => report.reporterId === userId);
  } catch (error) {
    // If there's an error fetching reports, assume no report exists
    console.error('Error checking existing reports:', error);
    return false;
  }
};
