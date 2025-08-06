import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IGetBookedVehicleUsecase } from "../../domain/interface/usecaseInterface/user/booking/IGetBookedVehicleUsecase";

export class GetBookedVehicleUsecase implements IGetBookedVehicleUsecase {
    private bookingRepository: IbookingRepostory;

    constructor(bookingRepository: IbookingRepostory) {
        this.bookingRepository = bookingRepository;
    }

    async execute(userId: string): Promise<string[] | null> {
        const bookedVehicles = await this.bookingRepository.getBookedVehiclesByVehicleId(userId);
            if (!bookedVehicles) {
                return null; 
            }
            console.log(bookedVehicles)
            return bookedVehicles;      
    }
}