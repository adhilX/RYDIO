import { AdminLoginInputDto, AdminLoginOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IAdminLoginUseCase {
    handleLogin(input: AdminLoginInputDto): Promise<AdminLoginOutputDto>
}