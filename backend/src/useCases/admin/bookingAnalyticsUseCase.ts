import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";

export class BookingAnalyticsUseCase {
    constructor(
        private bookingRepository: IBookingRepository
    ) {}

    async getBookingAnalytics(): Promise<{
        chartData: Array<{ day: string; bookings: number }>;
        activeCities: number;
        topCity: {
            name: string;
            bookings: number;
        };
    }> {
        try {
            // Get booking data for the last 7 days
            const chartData = await this.bookingRepository.getWeeklyBookingData();
            
            // Get number of active cities
            const activeCities = await this.bookingRepository.getActiveCitiesCount();
            
            // Get top city by bookings
            const topCity = await this.bookingRepository.getTopCityByBookings();

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
