import mongoose, { isValidObjectId, Types } from "mongoose";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { bookingModel } from "../../../framework/database/models/bookingModel";
import { BaseRepository } from "../base/BaseRepo";

export class BookingRepository extends BaseRepository<Ibooking> implements IbookingRepostory {
     constructor() {
          super(bookingModel);
     }

     async findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking | null> {
          return await bookingModel.findOne({ payment_intent_id })
     }

     async findByUserId(user_id: string, limit: number, page: number, search: string, status: string): Promise<{ bookings: Ibooking[], total: number } | null> {
          const skip = (page - 1) * limit;

          // Create the match condition
          const match: any = {
               user_id: new mongoose.Types.ObjectId(user_id),
               "vehicle.name": { $regex: search, $options: "i" }
          };

          if (status !== "all") {
               match.status = status;
          }

          // Fetch paginated bookings
          const bookings = await bookingModel.aggregate([
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
               { $unwind: "$location" },
               { $match: match },
               { $skip: skip },
               { $limit: limit },
               { $sort: { 'createdAt': -1 } }
          ]);

          // Count total matching bookings (no pagination)
          const totalCount = await bookingModel.aggregate([
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
               { $unwind: "$location" },
               { $match: match },
               {
                    $count: "total"
               }
          ]);

          const total = totalCount[0]?.total || 0;

          return { bookings, total };


     }
     async getBookingData(search: string, limit: number, page: number): Promise<{ bookings: Ibooking[], total: number } | null> {
          const skip = (page - 1) * limit;


          const matchConditions: any[] = [
               { "user.name": { $regex: search, $options: "i" } },
               { "vehicle.name": { $regex: search, $options: "i" } },
               { "vehicle.brand": { $regex: search, $options: "i" } },
               { "booking_id": { $regex: search, $options: "i" } }
          ];

          if (isValidObjectId(search)) {
               matchConditions.push({ _id: new Types.ObjectId(search) });
          }

          const bookings = await bookingModel.aggregate([
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
               { $unwind: "$vehicle" },

               {
                    $match: {
                         $or: matchConditions
                    }
               },

               { $skip: skip },
               { $limit: limit },
               { $sort: { 'createdAt': -1 } }
          ]);
          const total = bookings.length
          return { bookings, total }
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
     async getBookedVehiclesByVehicleId(vehicle_id: string): Promise<string[] | null> {

          const bookings = await bookingModel.find({
               vehicle_id: vehicle_id,
               status: "booked",
               payment_status: "paid",
          });

          console.log('Booked Vehicles:', bookings);
          let unavailableDates: string[] = [];

          bookings.forEach((booking) => {
               const start = new Date(booking.start_date);
               const end = new Date(booking.end_date);

               let current = new Date(start);
               while (current <= end) {
                    const dateStr = current.toISOString().split("T")[0];
                    unavailableDates.push(dateStr);
                    current.setDate(current.getDate() + 1);
               }
          });

          return unavailableDates;
     }

     async changeBookingStatus(booking_id: string, status: string): Promise<Ibooking | null> {
          return await bookingModel.findByIdAndUpdate(booking_id, { status })
     }
     async getOwnerBookings(userId: string, limit: number, page: number, search: string, status: string): Promise<{ bookings: Ibooking[], total: number } | null> {
          const skip = (page - 1) * limit;

          const match: any = {
               "vehicle.owner_id": new mongoose.Types.ObjectId(userId)
          };

          if (search && search.trim() !== '') {
               match["vehicle.name"] = { $regex: search, $options: "i" };
          }

          if (status !== "all") {
               match.status = status;
          }

          const pipeline: any[] = [
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
               { $unwind: "$location" },
               { $match: match },
               { $sort: { createdAt: -1 } },
               { $skip: skip },
               { $limit: limit }
          ];

          const countPipeline: any[] = [
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
               { $unwind: "$location" },
               { $match: match },
               { $count: "total" }
          ];

          const [bookings, totalResult] = await Promise.all([
               bookingModel.aggregate(pipeline),
               bookingModel.aggregate(countPipeline)
          ]);

          const total = totalResult[0]?.total || 0;

          return { bookings, total };
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
}
