import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IGetChatUsecase } from "../../../domain/interface/usecaseInterface/chat/IGetChatUsecase";

export class GetChatController {
    constructor(private _getChatUsecase: IGetChatUsecase) {
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
