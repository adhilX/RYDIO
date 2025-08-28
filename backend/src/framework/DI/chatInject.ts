import { ChatRepository } from "../../adapters/repository/chat/chatRepository";
import { MessageRepository } from "../../adapters/repository/message/messageRepository";
import { FindChatBTWOwnerAndUserUsecase } from "../../useCases/chat/findChatBTWOwnerAndUserUsecase";
import { CreateChatUseCase } from "../../useCases/chat/createChatUsecase";
import { CreateMessageUseCase } from "../../useCases/message/createMessageUsecase";


const chatRepository = new ChatRepository()
export const findChatBTWOwnerAndUserUsecase = new FindChatBTWOwnerAndUserUsecase(chatRepository)
export const createChatUsecase = new CreateChatUseCase(chatRepository)

const messageRepository = new MessageRepository()
export const createMessageUsecse = new CreateMessageUseCase(messageRepository,chatRepository)