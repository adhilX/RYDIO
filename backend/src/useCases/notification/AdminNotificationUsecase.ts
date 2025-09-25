import { INotification } from "../../domain/entities/notificationEntities";
import { ICreateNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";
import { IAdminNotificationUsecase, ISendNotificationInputDto, ISendNotificationOutputDto } from "../../domain/interface/usecaseInterface/notification/IAdminNotificationUsecase";

export class AdminNotificationUsecase implements IAdminNotificationUsecase {
    constructor(
        private _createNotificationUseCase: ICreateNotificationUsecase
    ) {}

    async sendNotificationToUser(input: ISendNotificationInputDto): Promise<ISendNotificationOutputDto> {
        const notification: INotification = {
            from: "Admin",
            to: input.userId,
            message: input.message,
            read: false,
            senderModel: 'owner',
            receiverModel: 'owner',
            type: input.type
        };

        const result = await this._createNotificationUseCase.createNotification(notification);
        
        return {
            notification: result,
            liveNotificationSent: true // The CreateNotificationUsecase handles live notifications automatically
        };
    }
}
