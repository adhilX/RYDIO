import { Imessage } from "../../../entities/messageEntities";

export interface IcreateMessageUsecase {
    createMessage(message: Imessage): Promise<Imessage>;
}
