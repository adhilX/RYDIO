import { IEnableChatOutputDto } from "../../DTOs/chatDto/chatDto";

export interface IEnableChatUsecase {
    checkBookingExists(userId: string, ownerId: string): Promise<IEnableChatOutputDto>
}
