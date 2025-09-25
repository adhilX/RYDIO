import { INotification } from "../../../entities/notificationEntities";

export interface ISendNotificationInputDto {
    userId: string;
    message: string;
    type: 'warning' | 'info' | 'success' | 'error';
}

export interface ISendNotificationOutputDto {
    notification: INotification;
    liveNotificationSent: boolean;
}

export interface IAdminNotificationUsecase {
    sendNotificationToUser(input: ISendNotificationInputDto): Promise<ISendNotificationOutputDto>;
}
