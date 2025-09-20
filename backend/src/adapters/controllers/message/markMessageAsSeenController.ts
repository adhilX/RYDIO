import { Request, Response } from "express";
import { IMessageRepository } from "../../../domain/interface/repositoryInterface/IMessageRepository";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class MarkMessageAsSeenController {
    private _messageRepository: IMessageRepository;

    constructor(messageRepository: IMessageRepository) {
        this._messageRepository = messageRepository;
    }

    async markMessageAsSeen(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params;
            
            if (!messageId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Message ID is required"
                });
                return;
            }

            const result = await this._messageRepository.markMessageAsSeen(messageId);
            
            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error marking message as seen:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to mark message as seen"
            });
        }
    }

    async markAllMessagesAsSeenInChat(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            
            if (!chatId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Chat ID is required"
                });
                return;
            }

            const result = await this._messageRepository.markAllMessagesAsSeenInChat(chatId);

            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error marking all messages as seen:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to mark all messages as seen"
            });
        }
    }
}
