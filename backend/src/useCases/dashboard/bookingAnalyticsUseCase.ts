import { IGetBookingAnalyticsOutPutDto } from "../../domain/interface/DTOs/DashboardDto/DashboardDto";
import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";
import { IBookingAnalyticsUseCase } from "../../domain/interface/usecaseInterface/dashboard/IBookingAnalyticsUseCase";

export class BookingAnalyticsUseCase implements IBookingAnalyticsUseCase {
    constructor(private _bookingRepository: IBookingRepository ) {}

    async getBookingAnalytics(): Promise<IGetBookingAnalyticsOutPutDto> {
        try {
            // Get booking data for the last 7 days
            const chartData = await this._bookingRepository.getWeeklyBookingData();
            
            // Get number of active cities
            const activeCities = await this._bookingRepository.getActiveCitiesCount();
            
            // Get top city by bookings
            const topCity = await this._bookingRepository.getTopCityByBookings();
            console.log(topCity)
            return {
                chartData,
                activeCities,
                topCity
            };
        } catch (error) {
            throw new Error(`Failed to get booking analytics: ${error}`);
        }
    }
}
