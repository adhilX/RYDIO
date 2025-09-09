import { Request, Response } from "express";
import { IgetMessagesUsecase } from "../../../domain/interface/usecaseInterface/message/IgetMessagesUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class GetMessageController {
    private getMessagesUsecase: IgetMessagesUsecase;

    constructor(getMessagesUsecase: IgetMessagesUsecase) {
        this.getMessagesUsecase = getMessagesUsecase;
    }

    async getMessagesByChatId(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            
            if (!chatId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Chat ID is required"
                });
                return;
            }

            const result = await this.getMessagesUsecase.getMessages(chatId);
            
            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error getting messages:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get messages"
            });
        }
    }
}
