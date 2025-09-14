import { INotification } from "../../../entities/notificationEntities";

export interface ICreateNotificationUsecase {
    createNotification(notification: INotification): Promise<INotification>;
}
