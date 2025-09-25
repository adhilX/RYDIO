import { Document, model, ObjectId } from "mongoose";
import { Report } from "../../../domain/entities/ReportEntities";
import { ReportSchema } from "../schema/reportSchema";

export interface IReportModel extends Omit<Report, '_id'>, Document {
  _id: ObjectId;
}

export const reportModel = model<Report>('report', ReportSchema);
