import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IWalletRepository } from "../../domain/interface/repositoryInterface/IwalletRepository";
import { IhashPassword } from "../../domain/interface/serviceInterface/IhashPassword";
import { IadminLoginUseCase } from "../../domain/interface/usecaseInterface/admin/Auth/IadminLoginUsecase";

export class LoginAdminUsecase implements IadminLoginUseCase {

    private adminRepository: IadminRepository
    private hashPassword: IhashPassword
    private walletRepository: IWalletRepository

    constructor(adminRepository: IadminRepository, hashPassword: IhashPassword, walletRepository: IWalletRepository) {
        this.hashPassword = hashPassword
        this.adminRepository = adminRepository
        this.walletRepository = walletRepository
    }

async handleLogin(email: string, password: string): Promise<Pick<User, '_id' | 'email' | 'name' | 'role'>> {
        const admin = await this.adminRepository.findByEmail(email)
        if (!admin) throw new Error('admin not exist with this Email')
            const existingWallet = await this.walletRepository.getWalletByUserId(admin._id?.toString()!);
        if (!existingWallet) {
            await this.walletRepository.createWallet(admin._id?.toString()!)
        }
        if (admin.role !== 'admin') throw new Error('this is not admin')
        const matchPass = await this.hashPassword.comparePassword(password, admin.password)
        if (!matchPass) throw new Error('password not match')
        return {
            _id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        };
    }

}