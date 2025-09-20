import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { ILoadPreviousChatUseCase } from "../../../domain/interface/usecaseInterface/message/ILoadPreviousChatUseCase";

export class LoadPreviousMessageController {
    private loadPreviousChatUseCase: ILoadPreviousChatUseCase
    constructor(loadPreviousChatUseCase: ILoadPreviousChatUseCase) {
        this.loadPreviousChatUseCase = loadPreviousChatUseCase
    }
    async handleLoadPreviousMessage(req: Request, res: Response): Promise<void> {
        try {
            const pageNo = req.query.pageNo as string
            const chatId = req.query.chatId as string
            if (!pageNo || !chatId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: "pageNo or chatId is nott provided" })
                return
            }
            // const page = parseInt(pageNo, 10) || 1
            const { messages } = await this.loadPreviousChatUseCase.loadPreviousChat(chatId)
            res.status(HttpStatus.OK).json({ message: "Previous chat loaded", messages })
        } catch (error) {
            console.log('error while loading previous message of chat', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "error while loading previous message of chat",
                error: error instanceof Error ? error.message : 'error while loading previous message of chat'
            })
        }
    }
}