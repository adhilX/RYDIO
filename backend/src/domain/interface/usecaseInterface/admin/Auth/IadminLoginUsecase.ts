import { AdminLoginInputDto, AdminLoginOutputDto } from "../../../DTOs/adminDto/AdminDto";

export interface IadminLoginUseCase {
    handleLogin(input: AdminLoginInputDto): Promise<AdminLoginOutputDto>
}