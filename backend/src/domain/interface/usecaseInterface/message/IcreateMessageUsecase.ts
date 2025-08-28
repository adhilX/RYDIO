import { Imessage } from "../../../entities/messageEntities";

export interface IcreateMessageUseCase {
    createMessage(message: Imessage): Promise<Imessage>;
}
