import { IMessage } from "../../../entities/messageEntities";

export interface ICreateMessageUsecase {
    createMessage(message: IMessage): Promise<IMessage>;
}
