import { Schema } from "mongoose";
import { Report, ReportStatus } from "../../../domain/entities/ReportEntities";

export const ReportSchema = new Schema<Report>({
  reporterId: { type: String },
  bookingId: { type: String},
  ownerId :{type:String},
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(ReportStatus),
    default: ReportStatus.PENDING,
    required: true
  }
}, { timestamps: true });
