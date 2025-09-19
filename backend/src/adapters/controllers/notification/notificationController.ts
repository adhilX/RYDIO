import { Request, Response } from "express";
import { IGetNotificationUsecase } from "../../../domain/interface/usecaseInterface/notification/IGetNotificationUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class NotificationController {
    constructor(private getNotificationUsecase: IGetNotificationUsecase) {}

    async getUserNotifications(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const notifications = await this.getNotificationUsecase.getNotificationsByUserId(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to fetch notifications"
            });
        }
    }

    async markNotificationAsRead(req: Request, res: Response): Promise<void> {
        try {
            const { notificationId } = req.params;
            const notification = await this.getNotificationUsecase.markNotificationAsRead(notificationId);
            
            if (!notification) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: "Notification not found"
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                data: notification
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to mark notification as read"
            });
        }
    }

    async markAllNotificationsAsRead(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const result = await this.getNotificationUsecase.markAllNotificationsAsRead(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to mark all notifications as read"
            });
        }
    }

    async getUnreadCount(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const countResult = await this.getNotificationUsecase.getUnreadNotificationCount(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: countResult
            });
        } catch (error) {
            console.error("Error fetching unread count:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to fetch unread count"
            });
        }
    }

    async deleteNotification(req: Request, res: Response): Promise<void> {
        try {
            const { notificationId } = req.params;
            if (!notificationId) {
                res.status(HttpStatus.BAD_REQUEST).json({ 
                    success: false, 
                    message: "Notification ID is required" 
                });
                return;
            }

            const result = await this.getNotificationUsecase.deleteNotification(notificationId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
                message: "Notification deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting notification:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete notification"
            });
        }
    }

    async deleteAllNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
                return;
            }

            const result = await this.getNotificationUsecase.deleteAllNotifications(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
                message: "All notifications deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting all notifications:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to delete all notifications"
            });
        }
    }
}
