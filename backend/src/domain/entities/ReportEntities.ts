

export enum ReportStatus {
  PENDING = "Pending",
  IN_REVIEW = "In Review",
  RESOLVED = "Resolved",
  DISMISSED = "Dismissed",
}

export interface Report {
  _id?: string; 
  reporterId: string; 
  bookingId: string;
  ownerId:string
  reason: string; 
  status: ReportStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
