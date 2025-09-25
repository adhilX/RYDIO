import { INotification } from "../../domain/entities/notificationEntities";
import { LiveNotificationDto } from "../../domain/interface/DTOs/notificationDto/notificationDto";
import { INotificationManagerAdapter } from "../../domain/interface/INotificationManager";
import { INotificationRepository } from "../../domain/interface/repositoryInterface/INotificationRepository";
import { ICreateNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";

export class CreateNotificationUsecase implements ICreateNotificationUsecase {
    constructor(
        private _notificationRepository: INotificationRepository,
        private _notificationManagerAdapter: INotificationManagerAdapter
    ) {}

    async createNotification(notification: INotification): Promise<INotification> {
        const newNotification = await this._notificationRepository.create(notification);
     console.log(notification,'notification')
        if(notification.from === "Admin"){
            console.log('nisideeee')
            const liveNotification: LiveNotificationDto = {
                _id: newNotification._id || '',
                from: {
                    _id: "admin",
                    name: "RYDIO Admin",
                    profileImage: ""
                },
                to: newNotification.to.toString(),
                message: newNotification.message,
                type: "warning"
            };
            this._notificationManagerAdapter.sendLiveNotification(liveNotification);
        }
        
        return newNotification
    }
}
