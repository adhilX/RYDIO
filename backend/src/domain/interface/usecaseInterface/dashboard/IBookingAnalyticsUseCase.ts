export interface IBookingAnalyticsUseCase {
    getBookingAnalytics(): Promise<{
        chartData: Array<{ day: string; bookings: number }>;
        activeCities: number;
        topCity: {
            name: string;
            bookings: number;
        };
    }>;
}
