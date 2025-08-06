import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IhashPassword } from "../../domain/interface/serviceInterface/IhashPassword";
import { IadminLoginUseCase } from "../../domain/interface/usecaseInterface/admin/Auth/IadminLoginUsecase";
import { IAdminWalletRepository } from "../../domain/interface/repositoryInterface/IAdminWalletRepository";

export class LoginAdminUsecase implements IadminLoginUseCase {

    private _adminRepository: IadminRepository
    private _hashPassword: IhashPassword
    private _adminWalletRepository: IAdminWalletRepository
    constructor(adminRepository: IadminRepository, hashPassword: IhashPassword,adminWalletRepository: IAdminWalletRepository) {
        this._adminRepository = adminRepository
        this._hashPassword = hashPassword
        this._adminWalletRepository = adminWalletRepository
    }

async handleLogin(email: string, password: string): Promise<Pick<User, '_id' | 'email' | 'name' | 'role'>> {
        const admin = await this._adminRepository.findByEmail(email)
        if (!admin) throw new Error('admin not exist with this Email')
        if (admin.role !== 'admin') throw new Error('this is not admin')
            await this._adminWalletRepository.createWallet()
        const matchPass = await this._hashPassword.comparePassword(password, admin.password)
        if (!matchPass) throw new Error('password not match')
        return {
            _id: admin._id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        };
    }

}