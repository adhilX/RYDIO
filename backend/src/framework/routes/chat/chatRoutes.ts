import { Request, Response, Router } from "express";
import { injectedUserBlockChecker, injectedVerfyToken, tokenTimeExpiryValidationMiddleware } from "../../DI/serviceInject";
import { checkRoleBaseMiddleware } from "../../../adapters/middlewares/checkRoleBasedMIddleware";
import { createChatController, getChatController } from "../../DI/chatInject";

export class ChatRoutes {
    public ChatRoutes: Router
    constructor() {
        this.ChatRoutes = Router();
        this.setRoutes();
    }

    private setRoutes() {

        this.ChatRoutes.use(injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('user'), injectedUserBlockChecker)

        // Chat routes
        this.ChatRoutes.post('/find-or-create', (req:Request, res:Response)=>{
            createChatController.findOrCreateChat(req,res)})
        
        this.ChatRoutes.get('/chats/:userId', (req:Request, res:Response)=>{
            getChatController.getChatsOfUser(req,res)}
        )
    }
}