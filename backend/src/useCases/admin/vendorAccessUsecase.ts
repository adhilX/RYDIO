import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { NotificationRepository } from "../../adapters/repository/notification/notificationRepository";
import { IVendorAccessUsecase } from "../../domain/interface/usecaseInterface/admin/IVendorAccessUsecase";
import { VendorAccessInputDto, VendorAccessOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";
import { INotification } from "../../domain/entities/notificationEntities";

export class VendorAccessUsecase implements IVendorAccessUsecase{
    private _adminRepository: IAdminRepository;
    private _notificationRepository: NotificationRepository;
    
    constructor(
        adminRepository: IAdminRepository,
        notificationRepository: NotificationRepository
    ) {
        this._adminRepository = adminRepository;
        this._notificationRepository = notificationRepository;
    }

 async vendorAccess(input: VendorAccessInputDto): Promise<VendorAccessOutputDto>{
    try {
        if(!input.userId) throw new Error('user id is required')
        if(typeof input.vendorAccess !== 'boolean') throw new Error('vendor access is required')
        
        // Update vendor access
        await this._adminRepository.vendorAccess(input.userId, input.vendorAccess)
        
        // Send notification to user
        const notificationMessage = input.vendorAccess 
            ? `🎉 Congratulations! You now have vendor access on RYDIO. You can start listing your vehicles for rent!`
            : `⚠️ Your vendor access has been revoked. You can no longer list vehicles for rent. Contact support if you have questions.`;

        const notification: INotification = {
            from: "Admin",
            to: input.userId,
            message: notificationMessage,
            read: false,
            senderModel: 'owner',
            receiverModel: 'owner'
        };

        await this._notificationRepository.create(notification);
        
        return {
            success: true,
            message: `Vendor access ${input.vendorAccess ? 'granted' : 'revoked'} successfully`
        };
    } catch (error) {
        console.error('Error in vendor access process:', error);
        throw error;
    }
 }
}