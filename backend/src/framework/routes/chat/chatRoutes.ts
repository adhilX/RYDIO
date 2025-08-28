import { Router } from "express";
import { GetChatController } from "../../../adapters/controllers/chat/getChatController";
import { GetMessageController } from "../../../adapters/controllers/message/getMessageController";
import { MarkMessageAsSeenController } from "../../../adapters/controllers/message/markMessageAsSeenController";

const router = Router();

// Initialize controllers (these would be injected via dependency injection in a real app)
// For now, we'll export the router structure
export const createChatRoutes = (
    getChatController: GetChatController,
    getMessageController: GetMessageController,
    markMessageAsSeenController: MarkMessageAsSeenController
) => {
    // Get user's chats
    router.get('/chats/user/:userId', getChatController.getChatsOfUser.bind(getChatController));
    
    // Get messages for a specific chat
    router.get('/chats/:chatId/messages', getMessageController.getMessagesByChatId.bind(getMessageController));
    
    // Mark single message as seen
    router.patch('/messages/:messageId/seen', markMessageAsSeenController.markMessageAsSeen.bind(markMessageAsSeenController));
    
    // Mark all messages in chat as seen
    router.patch('/chats/:chatId/messages/seen', markMessageAsSeenController.markAllMessagesAsSeenInChat.bind(markMessageAsSeenController));
    
    return router;
};

export default router;
