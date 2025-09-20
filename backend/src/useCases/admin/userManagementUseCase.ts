import { GetuserStatusOutputDto } from "../../domain/interface/DTOs/DashboardDto/DashboardDto";
import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IUserMangementUsecase } from "../../domain/interface/usecaseInterface/admin/IUserMangmentUsecase";

export class UserManagementUseCase  implements IUserMangementUsecase{
    constructor(
        private _userRepository: IUserRepository
    ) {}

    async getUserManagementStats(): Promise<GetuserStatusOutputDto> {
        try {
            const totalUsers = await this._userRepository.getTotalUsersCount();
            const activeUsers = await this._userRepository.getActiveUsersCount();
            const blockedUsers = await this._userRepository.getBlockedUsersCount();
            
            const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
            const blockedPercentage = totalUsers > 0 ? Math.round((blockedUsers / totalUsers) * 100) : 0;
            
            const vendorAccessRequests = await this._userRepository.getPendingVendorAccessRequests();
            const verificationRequests = await this._userRepository.getPendingVerificationRequests();
            
            // Generate chart data for user activity
            const chartData = await this._userRepository.getUserActivityChartData();

            return {
                totalUsers,
                activeUsers,
                blockedUsers,
                activePercentage,
                blockedPercentage,
                vendorAccessRequests,
                verificationRequests,
                chartData
            };
        } catch (error) {
            throw new Error(`Failed to get user management stats: ${error}`);
        }
    }
}
