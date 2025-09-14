export interface IEnableChatUsecase {
    checkBookingExists(userId: string, ownerId: string): Promise<{ canChat: boolean; message: string }>;
}
