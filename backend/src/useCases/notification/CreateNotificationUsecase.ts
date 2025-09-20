import { INotification } from "../../domain/entities/notificationEntities";
import { INotificationRepository } from "../../domain/interface/repositoryInterface/INotificationRepository";
import { ICreateNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";

export class CreateNotificationUsecase implements ICreateNotificationUsecase {
    constructor(
        private _notificationRepository: INotificationRepository
    ) {}

    async createNotification(notification: INotification): Promise<INotification> {
        return await this._notificationRepository.create(notification);
    }
}
