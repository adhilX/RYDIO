import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IhashPassword } from "../../domain/interface/serviceInterface/IhashPassword";
import { IAdminWalletRepository } from "../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { IAdminWallet } from "../../domain/entities/adminWalletEntities";
import { AdminLoginInputDto, AdminLoginOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";
import { IjwtService } from "../../domain/interface/serviceInterface/IjwtService";
import { IadminLoginUseCase } from "../../domain/interface/usecaseInterface/admin/IadminLoginUsecase";

export class LoginAdminUsecase implements IadminLoginUseCase{

    private _adminRepository: IadminRepository
    private _hashPassword: IhashPassword
    private _adminWalletRepository: IAdminWalletRepository
    private _jwtService: IjwtService
    constructor(adminRepository: IadminRepository, hashPassword: IhashPassword,adminWalletRepository: IAdminWalletRepository,jwtService: IjwtService) {
        this._adminRepository = adminRepository
        this._hashPassword = hashPassword
        this._adminWalletRepository = adminWalletRepository
        this._jwtService = jwtService
    }

async handleLogin(input: AdminLoginInputDto): Promise<AdminLoginOutputDto> {
        const admin = await this._adminRepository.findByEmail(input.email)
        if (!admin) throw new Error('admin not exist with this Email')
        if (admin.role !== 'admin') throw new Error('this is not admin')
        const existingWallet: IAdminWallet | null = await this._adminWalletRepository.getwalletDetails();
        if (!existingWallet) {
            await this._adminWalletRepository.createWallet()
        }
        const matchPass = await this._hashPassword.comparePassword(input.password, admin.password)
        if (!matchPass) throw new Error('password not match')

           
            const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string
            const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string
            const accessToken = this._jwtService.createAccessToken(ACCESS_TOKEN_KEY, admin._id?.toString() || "", admin.role)
            const refreshToken = this._jwtService.createRefreshToken(REFRESH_TOKEN_KEY, admin._id?.toString() || "")

            const adminData = {
                _id: admin._id!,
                email: admin.email,
                name: admin.name,
                role: admin.role as 'admin'
            }
        return {
           adminData,
           accessToken,
           refreshToken
        };
    }

}