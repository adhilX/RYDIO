import { GetuserStatusOutputDto } from "../../domain/interface/DTOs/DashboardDto/DashboardDto";
import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IUserMangementUsecase } from "../../domain/interface/usecaseInterface/admin/IUserMangmentUsecase";

export class UserManagementUseCase  implements IUserMangementUsecase{
    constructor(
        private userRepository: IUserRepository
    ) {}

    async getUserManagementStats(): Promise<GetuserStatusOutputDto> {
        try {
            const totalUsers = await this.userRepository.getTotalUsersCount();
            const activeUsers = await this.userRepository.getActiveUsersCount();
            const blockedUsers = await this.userRepository.getBlockedUsersCount();
            
            const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
            const blockedPercentage = totalUsers > 0 ? Math.round((blockedUsers / totalUsers) * 100) : 0;
            
            const vendorAccessRequests = await this.userRepository.getPendingVendorAccessRequests();
            const verificationRequests = await this.userRepository.getPendingVerificationRequests();
            
            // Generate chart data for user activity
            const chartData = await this.userRepository.getUserActivityChartData();

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
