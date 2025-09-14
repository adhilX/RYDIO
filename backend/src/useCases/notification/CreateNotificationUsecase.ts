import { INotification } from "../../domain/entities/notificationEntities";
import { INotificationRepository } from "../../domain/interface/repositoryInterface/INotificationRepository";
import { ICreateNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";

export class CreateNotificationUsecase implements ICreateNotificationUsecase {
    constructor(
        private notificationRepository: INotificationRepository
    ) {}

    async createNotification(notification: INotification): Promise<INotification> {
        console.log('notificatons creading ')
        return await this.notificationRepository.create(notification);
    }
}
