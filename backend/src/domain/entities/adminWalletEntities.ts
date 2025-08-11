import { IWallet } from "./walletEnties";

export interface IAdminWallet extends Omit<IWallet,'user_id'|'is_frozen'>{
  commission_balance: number,
  penalty_balance: number,
  total_balance: number,
}