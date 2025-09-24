
import { IChangeVehicleStatusUsecase } from "../../../domain/interface/usecaseInterface/admin/vehicles/IChangeVehicleStatusUsecase";
import { VehicleApprovalInputDto, VehicleApprovalOutputDto } from "../../../domain/interface/DTOs/adminDto/AdminDto";
import { INotification } from "../../../domain/entities/notificationEntities";
import { INotificationRepository } from "../../../domain/interface/repositoryInterface/INotificationRepository";
import { IVehicleRepository } from "../../../domain/interface/repositoryInterface/IVehicleRepository";

export class VehicleUpproveUsecase implements IChangeVehicleStatusUsecase {
    private _vehicleRepository: IVehicleRepository;
    private _notificationRepository: INotificationRepository;
    
    constructor(
        vehicleRepository: IVehicleRepository,
        notificationRepository: INotificationRepository
    ) {
        this._vehicleRepository = vehicleRepository;
        this._notificationRepository = notificationRepository;
    }
    async approveVehicle(input: VehicleApprovalInputDto): Promise<VehicleApprovalOutputDto> {
        try {
            // Get vehicle details to find the owner
            const vehicle = await this._vehicleRepository.findById(input.id);
            if (!vehicle) {
                throw new Error('Vehicle not found');
            }

            let notificationMessage = '';
            let notificationSent = false;

            if (input.action === 'accepted') {
                await this._vehicleRepository.approveVehicle(input.id, input.action);
                notificationMessage = `🎉 Great news! Your vehicle "${vehicle.name}" has been approved and is now live on RYDIO. You can start receiving bookings!`;
                
                // Send approval notification
                const notification: INotification = {
                    from: "Admin", 
                    to: vehicle.owner_id as any,
                    message: notificationMessage,
                    read: false,
                    senderModel: 'owner',
                    receiverModel: 'owner'
                };

                const savedNotification = await this._notificationRepository.create(notification);
                notificationSent = true;

                // Send live notification if user is online
                // const ownerId = vehicle.owner_id.toString();
                // const isOwnerOnline = this.socketController.isUserOnline(ownerId);
                
                // if (isOwnerOnline) {
                //     console.log(`Vehicle owner ${ownerId} is online, sending live notification for vehicle approval`);
                //     const liveNotification = {
                //         ...savedNotification,
                //         from: {
                //             _id: "Admin",
                //             name: "RYDIO Admin",
                //             profileImage: ""
                //         },
                //         type: "vehicle_approval",
                //         vehicleName: vehicle.name
                //     };
                //     this.socketController.sendLiveNotification(ownerId, liveNotification);
                // } else {
                //     console.log(`Vehicle owner ${ownerId} is offline, notification saved to database only`);
                // }

                return {
                    success: true,
                    message: 'Vehicle approved successfully'
                };
            } else {
                // await this._vehicleRepository.rejectVehicle(input.id, input.action, input.reason);
                // notificationMessage = `❌ Your vehicle "${vehicle.name}" has been rejected. Reason: ${input.reason || 'No specific reason provided'}. Please review and resubmit with the necessary corrections.`;
                
                // // Send rejection notification
                // const notification: INotification = {
                //     from: "Admin",
                //     to: vehicle.owner_id as any,
                //     message: notificationMessage,
                //     read: false,
                //     senderModel: 'owner',
                //     receiverModel: 'owner'
                // };

                // const savedNotification = await this._notificationRepository.create(notification);
                // notificationSent = true;

                // // Send live notification if user is online
                // const ownerId = vehicle.owner_id.toString();
                // const isOwnerOnline = this.socketController.isUserOnline(ownerId);
                
                // if (isOwnerOnline) {
                //     console.log(`Vehicle owner ${ownerId} is online, sending live notification for vehicle rejection`);
                //     const liveNotification = {
                //         ...savedNotification,
                //         from: {
                //             _id: "Admin",
                //             name: "RYDIO Admin",
                //             profileImage: ""
                //         },
                //         type: "vehicle_rejection",
                //         vehicleName: vehicle.name,
                //         reason: input.reason
                //     };
                //     this.socketController.sendLiveNotification(ownerId, liveNotification);
                // } else {
                //     console.log(`Vehicle owner ${ownerId} is offline, notification saved to database only`);
                // }

                return {
                    success: true,
                    message: 'Vehicle rejected successfully'
                };
            }
        } catch (error) {
            console.error('Error in vehicle approval process:', error);
            throw error;
        }
    }
}