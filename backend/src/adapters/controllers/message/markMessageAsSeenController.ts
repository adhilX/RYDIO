import { Request, Response } from "express";
import { IMessageRepository } from "../../../domain/interface/repositoryInterface/IMessageRepository";

export class MarkMessageAsSeenController {
    private messageRepository: IMessageRepository;

    constructor(messageRepository: IMessageRepository) {
        this.messageRepository = messageRepository;
    }

    async markMessageAsSeen(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params;
            
            if (!messageId) {
                res.status(400).json({
                    success: false,
                    message: "Message ID is required"
                });
                return;
            }

            const result = await this.messageRepository.markMessageAsSeen(messageId);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error marking message as seen:", error);
            res.status(500).json({
                success: false,
                message: "Failed to mark message as seen"
            });
        }
    }

    async markAllMessagesAsSeenInChat(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            
            if (!chatId) {
                res.status(400).json({
                    success: false,
                    message: "Chat ID is required"
                });
                return;
            }

            const result = await this.messageRepository.markAllMessagesAsSeenInChat(chatId);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error marking all messages as seen:", error);
            res.status(500).json({
                success: false,
                message: "Failed to mark all messages as seen"
            });
        }
    }
}
