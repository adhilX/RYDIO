import mongoose, { isValidObjectId, Types } from "mongoose";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { bookingModel } from "../../../framework/database/models/bookingModel";

export class BookingRepository implements IbookingRepostory {
     async createBooking(booking: Ibooking): Promise<Ibooking> {
          if (typeof booking.vehicle_id == "string") {
               booking.vehicle_id = new Types.ObjectId(booking.vehicle_id) as unknown as typeof booking.vehicle_id
          }
          return await bookingModel.create(booking);
     }
     async findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking | null> {
          return await bookingModel.findOne({ payment_intent_id })
     }

     async findByUserId(user_id: string, limit: number, page: number, search: string, status: string): Promise<{ bookings: Ibooking[], total: number } | null> {
          console.log(user_id, limit, page, search, status)
          const skip = (page - 1) * limit;
          let match: any = { "user_id": new mongoose.Types.ObjectId(user_id), "vehicle.name": { $regex: search, $options: "i" } }
          if (status !== "all") {
               match.status = status
          }
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
                         from: 'locations',
                         localField: 'vehicle.location_id',
                         foreignField: '_id',
                         as: 'location'
                    }
               },
               { $unwind: '$location' },
               { $match: match },
               { $skip: skip },
               { $limit: limit }
          ]);
          return { bookings, total: bookings.length }
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
               {$sort:{'createdAt':-1}}
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
}
