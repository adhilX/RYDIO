import { Schema,Types } from "mongoose";
import { IAdminWallet } from "../../../domain/entities/adminWalletEntities";

  export const adminWalletSchema = new Schema<IAdminWallet>({   
            balance:{type: Number, required: true, default: 0},
            commission_balance:{type: Number, required: true, default: 0},
            penalty_balance:{type: Number, required: true, default: 0},
            refund_reserve:{type: Number, required: true, default: 0},
            total_balance:{type: Number, required: true, default: 0},
            transactions:[{type: Types.ObjectId, ref: 'transaction'}]
  })