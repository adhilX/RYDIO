import { ChatRepository } from "../../adapters/repository/chat/chatRepository";
import { MessageRepository } from "../../adapters/repository/message/messageRepository";
import { FindOrCreateChatUsecase } from "../../useCases/chat/FindOrCreateChatUsecase";
import { CreateMessageUseCase } from "../../useCases/message/createMessageUsecase";
import { GetMessagesUsecase } from "../../useCases/message/getMessagesUsecase";
// Controllers
import { GetMessageController } from "../../adapters/controllers/message/getMessageController";
import { MarkMessageAsSeenController } from "../../adapters/controllers/message/markMessageAsSeenController";
import { GetChatController } from "../../adapters/controllers/chat/getChatController";
import { FindOrCreateChatController } from "../../adapters/controllers/chat/FindOrCreateChatController";
import { GetChatUsecase } from "../../useCases/chat/getchatsOfUser";
// Repositories
const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();

// Use Cases
 const findOrCreateChatUsecase = new FindOrCreateChatUsecase(chatRepository);
export const createMessageUseCase = new CreateMessageUseCase(messageRepository);
 const getMessagesUsecase = new GetMessagesUsecase(messageRepository);
 const getChatUsecase = new GetChatUsecase(chatRepository);

// Controllers
export const createChatController = new FindOrCreateChatController(findOrCreateChatUsecase);
export const getChatController = new GetChatController(getChatUsecase);
export const getMessageController = new GetMessageController(getMessagesUsecase);
export const markMessageAsSeenController = new MarkMessageAsSeenController(messageRepository);