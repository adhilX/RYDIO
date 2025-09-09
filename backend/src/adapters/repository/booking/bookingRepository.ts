import mongoose, { isValidObjectId, Types } from "mongoose";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IBookingRepository } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { bookingModel } from "../../../framework/database/models/bookingModel";
import { BaseRepository } from "../base/BaseRepo";

export class BookingRepository extends BaseRepository<Ibooking> implements IBookingRepository {
     constructor() {
          super(bookingModel);
     }

     /**
      * Creates base aggregation pipeline with user and vehicle lookups
      */
     private createBaseAggregationPipeline(): any[] {
          return [
               {
                    $lookup: {
                         from: "users",
                         localField: "user_id",
                         foreignField: "_id",
                         as: "user"
                    }
               },
               { $unwind: "$user" },
               {
                    $lookup: {
                         from: "vehicles",
                         localField: "vehicle_id",
                         foreignField: "_id",
                         as: "vehicle"
                    }
               },
               { $unwind: "$vehicle" }
          ];
     }

     /**
      * Creates vehicle aggregation pipeline with location lookup
      */
     private createVehicleAggregationPipeline(): any[] {
          return [
               {
                    $lookup: {
                         from: "vehicles",
                         localField: "vehicle_id",
                         foreignField: "_id",
                         as: "vehicle"
                    }
               },
               { $unwind: "$vehicle" },
               {
                    $lookup: {
                         from: "locations",
                         localField: "vehicle.location_id",
                         foreignField: "_id",
                         as: "location"
                    }
               },
               { $unwind: "$location" }
          ];
     }

     /**
      * Executes aggregation pipeline and returns paginated results with total count
      */
     private async executeAggregationWithCount(
          matchStage: any,
          limit: number,
          page: number,
          additionalPipelineStages: any[] = []
     ): Promise<{ bookings: Ibooking[], total: number }> {
          const skip = (page - 1) * limit;
          const basePipeline = this.createBaseAggregationPipeline();

          // Pipeline for paginated results
          const dataPipeline = [
               ...basePipeline,
               ...additionalPipelineStages,
               { $match: matchStage },
               { $skip: skip },
               { $limit: limit },
               { $sort: { 'createdAt': -1 } }
          ];

          // Pipeline for total count
          const countPipeline = [
               ...basePipeline,
               ...additionalPipelineStages,
               { $match: matchStage },
               { $count: "total" }
          ];

          const [bookings, totalCount] = await Promise.all([
               bookingModel.aggregate(dataPipeline),
               bookingModel.aggregate(countPipeline)
          ]);

          const total = totalCount[0]?.total || 0;
          return { bookings, total };
     }

     /**
      * Executes vehicle-based aggregation pipeline and returns paginated results with total count
      */
     private async executeVehicleAggregationWithCount(
          matchStage: any,
          limit: number,
          page: number
     ): Promise<{ bookings: Ibooking[], total: number }> {
          const skip = (page - 1) * limit;
          const basePipeline = this.createVehicleAggregationPipeline();

          // Pipeline for paginated results
          const dataPipeline = [
               ...basePipeline,
               { $match: matchStage },
               { $skip: skip },
               { $limit: limit },
               { $sort: { 'createdAt': -1 } }
          ];

          // Pipeline for total count
          const countPipeline = [
               ...basePipeline,
               { $match: matchStage },
               { $count: "total" }
          ];

          const [bookings, totalCount] = await Promise.all([
               bookingModel.aggregate(dataPipeline),
               bookingModel.aggregate(countPipeline)
          ]);

          const total = totalCount[0]?.total || 0;
          return { bookings, total };
     }

     async findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking | null> {
          return await bookingModel.findOne({ payment_intent_id })
     }

     async findByUserId(user_id: string, limit: number, page: number, search: string, status: string): Promise<{ bookings: Ibooking[], total: number } | null> {
          // Create the match condition
          const match: any = {
               user_id: new mongoose.Types.ObjectId(user_id),
               "vehicle.name": { $regex: search, $options: "i" }
          };

          if (status !== "all") {
               match.status = status;
          }

          return await this.executeVehicleAggregationWithCount(match, limit, page);
     }
     async getBookingData(search: string, limit: number, page: number): Promise<{ bookings: Ibooking[], total: number } | null> {
          const matchConditions: any[] = [
               { "user.name": { $regex: search, $options: "i" } },
               { "vehicle.name": { $regex: search, $options: "i" } },
               { "vehicle.brand": { $regex: search, $options: "i" } },
               { "booking_id": { $regex: search, $options: "i" } }
          ];

          if (isValidObjectId(search)) {
               matchConditions.push({ _id: new Types.ObjectId(search) });
          }

          const matchStage = { $or: matchConditions };
          return await this.executeAggregationWithCount(matchStage, limit, page);
     }

     async bookedVehicle(pickupDate: string, returnDate: string): Promise<string[]> {
          const pickup = new Date(pickupDate);
          const returnD = new Date(returnDate);
          const bookings = await bookingModel.find({
               status: { $in: ['booked'] },
               $or: [
                    {
                         start_date: { $lt: returnD },
                         end_date: { $gt: pickup }
                    }
               ]
          });

          const vehicleIds = bookings.map(b => b.vehicle_id.toString());
          return [...new Set(vehicleIds)];
     }

     async getBookedBookingsByVehicleId(vehicle_id: string): Promise<Ibooking[]|null> {
          return await bookingModel.find({
            vehicle_id,
            status: "booked",
            payment_status: "paid",
          });
        }

        
     async changeBookingStatus(booking_id: string, status: string): Promise<Ibooking | null> {
        return await bookingModel.findOneAndUpdate({ booking_id }, { status }, { new: true })
    }

     async getOwnerBookings(userId: string, limit: number, page: number, search: string, status: string): Promise<{ bookings: Ibooking[], total: number } | null> {
          const match: any = {
               "vehicle.owner_id": new mongoose.Types.ObjectId(userId)
          };

          if (search && search.trim() !== '') {
               match["vehicle.name"] = { $regex: search, $options: "i" };
          }

          if (status !== "all") {
               match.status = status;
          }

          return await this.executeVehicleAggregationWithCount(match, limit, page);
     }
     async cancelBooking(booking_id:string,reason:string): Promise<boolean> {
          await bookingModel.findOneAndUpdate({booking_id}, { status: "cancelled", cancellation_reason: reason });
          return true;
     }

     async endRide(booking: Ibooking): Promise<Ibooking | null> {
          return await bookingModel.findOneAndUpdate(
               { booking_id: booking.booking_id }, 
               { 
                    ride_end_time: booking.ride_end_time,
                    status: "completed",
                    finance: booking.finance
               },
               { new: true }
          );
     }

     async updateBookingFinance(booking_id: string, updateData: any): Promise<Ibooking | null> {
          return await bookingModel.findOneAndUpdate(
               { booking_id },
               { $set: updateData },
               { new: true }
          );
     }

     async findByBookingId(booking_id:string): Promise<Ibooking | null> {
          return await bookingModel.findOne({booking_id})
     }
}
