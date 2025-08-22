export interface IIdGeneratorService {
  generateBookingId(): Promise<string>;
  generateWalletId(): Promise<string>;
}