import { Router, Request, Response } from "express";
import { notificationController } from "../../DI/userInject";
import { injectedUserBlockChecker, injectedVerfyToken, tokenTimeExpiryValidationMiddleware } from "../../DI/serviceInject";
import { checkRoleBaseMiddleware } from "../../../adapters/middlewares/checkRoleBasedMIddleware";

export class NotificationRoutes {
    public NotificationRoutes: Router
    constructor() {
        this.NotificationRoutes = Router();
        this.setRoutes();
    }
    private setRoutes() {

        this.NotificationRoutes.use(injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('user'),injectedUserBlockChecker)

        this.NotificationRoutes.get('/:userId', (req: Request, res: Response) => {
            notificationController.getUserNotifications(req, res)

        });
        this.NotificationRoutes.patch('/:notificationId/read', (req: Request, res: Response) => {
            notificationController.markNotificationAsRead(req, res)
        });
        this.NotificationRoutes.patch('/mark-all-read/:userId', (req: Request, res: Response) => {
            notificationController.markAllNotificationsAsRead(req, res)
        });
        this.NotificationRoutes.get('/unread-count/:userId', (req: Request, res: Response) => {
            notificationController.getUnreadCount(req, res)
        });
        this.NotificationRoutes.delete('/:notificationId', (req: Request, res: Response) => {
            notificationController.deleteNotification(req, res)
        });
        this.NotificationRoutes.delete('/delete-all/:userId', (req: Request, res: Response) => {
            notificationController.deleteAllNotifications(req, res)
        });
    }

}
