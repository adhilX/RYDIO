export interface IrideStartUsecase {
    rideStart(booking_id:string, scanner_user_id:string):Promise<boolean>
}