export interface IWithdrawalUsecase {
 userWithdrawal(bookingId: string, userId: string): Promise<boolean>
}