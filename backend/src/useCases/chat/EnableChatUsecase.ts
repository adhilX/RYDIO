import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";
import { IEnableChatUsecase } from "../../domain/interface/usecaseInterface/chat/IEnableChatUsecase";

export class EnableChatUsecase implements IEnableChatUsecase {
    private _bookingRepository: IBookingRepository;

    constructor(bookingRepository: IBookingRepository) {
        this._bookingRepository = bookingRepository;
    }

    async checkBookingExists(userId: string, ownerId: string): Promise<{ canChat: boolean; message: string }> {
        try {
            const booking = await this._bookingRepository.checkBookingExistsBetweenUserAndOwner(userId, ownerId);
            
            if (booking) {
                return {
                    canChat: true,
                    message: "Chat enabled - Active booking found between user and owner"
                };
            } else {
                return {
                    canChat: false,
                    message: "Chat not available - No active booking found between user and owner"
                };
            }
        } catch (error) {
            console.error("Error checking booking exists:", error);
            return {
                canChat: false,
                message: "Error checking booking status"
            };
        }
    }
}
