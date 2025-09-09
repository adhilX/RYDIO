import { Request, Response } from "express";
import { IFindOrCreateChatUsecase } from "../../../domain/interface/usecaseInterface/chat/IFindOrCreateChatUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class FindOrCreateChatController {
    private createChatUseCase: IFindOrCreateChatUsecase;

    constructor(createChatUseCase: IFindOrCreateChatUsecase) {
        this.createChatUseCase = createChatUseCase;
    }

    async findOrCreateChat(req: Request, res: Response): Promise<void> {
        try {
            const { userId, ownerId } = req.body;
            if (!userId || !ownerId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Missing required fields"
                });
                return;
            }
             const chat = await this.createChatUseCase.createChat({ userId, ownerId });
            res.status(HttpStatus.OK).json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error("Error finding/creating chat:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to find or create chat"
            });
        }
    }
}
