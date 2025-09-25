import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IVendorAccessUsecase } from "../../domain/interface/usecaseInterface/admin/IVendorAccessUsecase";
import { VendorAccessInputDto, VendorAccessOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";
import { INotification } from "../../domain/entities/notificationEntities";
import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { ICreateNotificationUsecase } from "../../domain/interface/usecaseInterface/notification/ICreateNotificationUsecase";

export class VendorAccessUsecase implements IVendorAccessUsecase{
  
    constructor(
      private _adminRepository: IAdminRepository,
      private _createNotificationUsecase: ICreateNotificationUsecase,
      private _vehicleRepository: IVehicleRepository,
    )  {}

 async vendorAccess(input: VendorAccessInputDto): Promise<VendorAccessOutputDto>{
    try {
        if(!input.userId) throw new Error('user id is required')
        if(typeof input.vendorAccess !== 'boolean') throw new Error('vendor access is required')
        
        // Update vendor access
        await this._adminRepository.vendorAccess(input.userId, input.vendorAccess)
        await this._vehicleRepository.changeVehicleStatus(input.userId,false)
        // Send notification to user
        const notificationMessage = input.vendorAccess 
        ? `⚠️ Your vendor access has been revoked. You can no longer list vehicles for rent. Contact support if you have questions.`
         :`🎉 Congratulations! You now have vendor access on RYDIO. You can start listing your vehicles for rent!`

        const notification: INotification = {
            from: "Admin",
            to: input.userId,
            message: notificationMessage,
            read: false,
            senderModel: 'owner',
            receiverModel: 'owner',
            type: input.vendorAccess ? 'warning' : 'success'
        };

        await this._createNotificationUsecase.createNotification(notification)
    
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