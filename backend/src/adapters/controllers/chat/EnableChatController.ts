import { Request, Response } from "express";
import { IEnableChatUsecase } from "../../../domain/interface/usecaseInterface/chat/IEnableChatUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class EnableChatController {
    private enableChatUseCase: IEnableChatUsecase;

    constructor(enableChatUseCase: IEnableChatUsecase) {
        this.enableChatUseCase = enableChatUseCase;
    }

    async enableChat(req: Request, res: Response): Promise<void> {
        try {
            const { userId, ownerId } = req.body;
            
            if (!userId || !ownerId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required fields: userId and ownerId"
                });
                return;
            }

            const result = await this.enableChatUseCase.checkBookingExists(userId, ownerId);
            
            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error checking chat eligibility:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to check chat eligibility"
            });
        }
    }
}
