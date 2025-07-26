import mongoose, { Types } from "mongoose";
import { Ibooking } from "../../../domain/entities/BookingEntities";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { bookingModel } from "../../../framework/database/models/bookingModel";

export class BookingRepository implements IbookingRepostory{
    async createBooking(booking: Ibooking): Promise<Ibooking> {
      if(typeof booking.vehicle_id == "string"){
    booking.vehicle_id = new Types.ObjectId(booking.vehicle_id) as unknown as typeof booking.vehicle_id
    }
     return  await bookingModel.create(booking);      
    }
    async findByPaymentIntentId(payment_intent_id: string): Promise<Ibooking|null> {
      return await bookingModel.findOne({payment_intent_id})
    }

    async findByUserId(user_id: string,limit: number,page: number,search: string,status:string): Promise<{bookings:Ibooking[],total:number}|null> {
     console.log(user_id,limit,page,search,status)
      const skip = (page - 1) * limit;
      let match:any ={"user_id":new mongoose.Types.ObjectId(user_id),"vehicle.name":{ $regex: search, $options: "i" }}
      if (status !== "all"){
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
          {$lookup: {
      from:'locations',
      localField:'vehicle.location_id',
      foreignField:'_id',
      as:'location'
    }},
    {$unwind:'$location'},
        {$match:match},
        { $skip: skip },
        { $limit: limit }
      ]);
      return {bookings,total:bookings.length}
    }
   async getBookingData(search: string, limit: number, page: number): Promise<{bookings:Ibooking[],total: number} | null> {
  const skip = (page - 1) * limit;

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
        "user.name": { $regex: search, $options: "i" }
      }
    },

    { $skip: skip },
    { $limit: limit }
  ]);
  const total = bookings.length
  return {bookings,total}
}

}