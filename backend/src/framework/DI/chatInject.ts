import { ChatRepository } from "../../adapters/repository/chat/chatRepository";
import { MessageRepository } from "../../adapters/repository/message/messageRepository";
import { BookingRepository } from "../../adapters/repository/booking/bookingRepository";
import { FindOrCreateChatUsecase } from "../../useCases/chat/FindOrCreateChatUsecase";
import { EnableChatUsecase } from "../../useCases/chat/EnableChatUsecase";
import { CreateMessageUseCase } from "../../useCases/message/createMessageUsecase";
import { GetMessagesUsecase } from "../../useCases/message/getMessagesUsecase";
// Controllers
import { GetMessageController } from "../../adapters/controllers/message/getMessageController";
import { MarkMessageAsSeenController } from "../../adapters/controllers/message/markMessageAsSeenController";
import { GetChatController } from "../../adapters/controllers/chat/getChatController";
import { FindOrCreateChatController } from "../../adapters/controllers/chat/FindOrCreateChatController";
import { EnableChatController } from "../../adapters/controllers/chat/EnableChatController";
import { GetChatUsecase } from "../../useCases/chat/getchatsOfUser";
import { UpdateLastMessageUseCase } from "../../useCases/message/UpdateLastMessageUseCase";
import { CreateNotificationUsecase } from "../../useCases/notification/CreateNotificationUsecase";
import { NotificationRepository } from "../../adapters/repository/notification/notificationRepository";
// Repositories
const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();
const bookingRepository = new BookingRepository();
const notificationRepository =  new NotificationRepository()
// Use Cases
 const findOrCreateChatUsecase = new FindOrCreateChatUsecase(chatRepository);
export const createMessageUseCase = new CreateMessageUseCase(messageRepository);
 const getMessagesUsecase = new GetMessagesUsecase(messageRepository);
 const getChatUsecase = new GetChatUsecase(chatRepository);
 const enableChatUsecase = new EnableChatUsecase(bookingRepository);
export const updateLastMessageUseCase = new UpdateLastMessageUseCase(chatRepository);
export const createNotificationUsecase = new CreateNotificationUsecase(notificationRepository)

// Controllers
export const createChatController = new FindOrCreateChatController(findOrCreateChatUsecase);
export const getChatController = new GetChatController(getChatUsecase);
export const getMessageController = new GetMessageController(getMessagesUsecase);
export const markMessageAsSeenController = new MarkMessageAsSeenController(messageRepository);
export const enableChatController = new EnableChatController(enableChatUsecase);