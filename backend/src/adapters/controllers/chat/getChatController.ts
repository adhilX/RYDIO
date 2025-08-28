import { Request, Response } from "express";
import { IchatRepository } from "../../../domain/interface/repositoryInterface/IchatRepository";

export class GetChatController {
    private chatRepository: IchatRepository;

    constructor(chatRepository: IchatRepository) {
        this.chatRepository = chatRepository;
    }

    async getChatsOfUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { page = 1 } = req.query;
            
            const result = await this.chatRepository.getchatsOfUser(userId, Number(page));
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error getting user chats:", error);
            res.status(500).json({
                success: false,
                message: "Failed to get chats"
            });
        }
    }
}
