export interface IcancelBookingUseCase {
    execute(bookingId: string,reason:string): Promise<boolean>
}