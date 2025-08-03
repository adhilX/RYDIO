export interface IWallet{
    user_id: string;
    balance: number;
    transaction_history: {
        type: string;
        amount: number;
        timestamp: Date;
    }[];
}