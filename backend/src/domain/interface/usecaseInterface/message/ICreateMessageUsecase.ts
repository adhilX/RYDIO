import { Imessage } from "../../../entities/messageEntities";

export interface ICreateMessageUsecase {
    createMessage(message: Imessage): Promise<Imessage>;
}
