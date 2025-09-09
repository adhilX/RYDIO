
import { IAdminRepository } from "../../domain/interface/repositoryInterface/IAdminRepository";
import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IJwtService } from "../../domain/interface/serviceInterface/IJwtService";
import { IRefreshTokenUseCase } from "../../domain/interface/usecaseInterface/auth/IRefreshTokenUseCase";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    private _jwtService: IJwtService
    private _userRepository: IUserRepository
    private _adminRepository: IAdminRepository
    constructor(
        jwtService: IJwtService,
        userRepository: IUserRepository,
        adminRepository: IAdminRepository
    ) {
        this._adminRepository = adminRepository
        this._userRepository = userRepository
        this._jwtService = jwtService
    }

    async execute(token: string): Promise<string> {
        const payload = this._jwtService.verifyRefreshToken(token, process.env.REFRESH_TOKEN_KEY as string)
        if (!payload) throw new Error('Invalid or Expired Refresh Token')
        console.log('refresh token here')
        const userId = payload.userId
        const client = await this._userRepository.findById(userId)
        const admin = await this._adminRepository.findById(userId)
        const user = client || admin
        const role = client ? 'user' : admin ? 'admin' : null;
        if (!user || !role) throw new Error('User Not Found')

        const newAccessToken = this._jwtService.createAccessToken(process.env.ACCESS_TOKEN_KEY as string, userId, role)
        return newAccessToken
    }
}