import { Request, Response, Router } from "express";
import { refreshTokenController } from "../../DI/serviceInject";

export class AuthRoute {
    public AuthRouter: Router
    constructor() {
        this.AuthRouter = Router()
        this.setRoute()
    }
    private setRoute() {
        this.AuthRouter.get('/', (req: Request, res: Response) => {
            console.log('hyy iam here')
            refreshTokenController.handleRefreshToken(req, res)
        })
    }
}