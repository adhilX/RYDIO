import { Request, Response } from "express";
import { IGetMessagesUsecase } from "../../../domain/interface/usecaseInterface/message/IGetMessagesUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class GetMessageController {
    private _getMessagesUsecase: IGetMessagesUsecase;

    constructor(getMessagesUsecase: IGetMessagesUsecase) {
        this._getMessagesUsecase = getMessagesUsecase;
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

            const result = await this._getMessagesUsecase.getMessages(chatId);
            
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
