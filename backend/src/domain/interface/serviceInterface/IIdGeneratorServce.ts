export interface IIdGeneratorService {
  generateBookingId(): Promise<string>;
}