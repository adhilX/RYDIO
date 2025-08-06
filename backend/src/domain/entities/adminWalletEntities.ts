import { IWallet } from "./walletEnties";

export interface IAdminWallet extends IWallet{
  commission_balance: number,
  penalty_balance: number,
  refund_reserve: number,
  total_balance: number,
}