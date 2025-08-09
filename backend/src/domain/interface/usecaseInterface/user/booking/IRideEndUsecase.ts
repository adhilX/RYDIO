export interface IRideEndUsecase {
    execute(bookingId: string,scanner_user_id:string): Promise<boolean>
}