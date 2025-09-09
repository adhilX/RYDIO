import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IgetChatUsecase } from "../../../domain/interface/usecaseInterface/chat/IgetChatUsecase";

export class GetChatController {
    constructor(private _getChatUsecase: IgetChatUsecase) {
    }

    async getChatsOfUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const result = await this._getChatUsecase.getchatsOfUser(userId)
            res.status(HttpStatus.OK).json({success: true,data: result});
        } catch (error) {
            console.error("Error getting user chats:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to get chats"
            });
        }
    }
}
