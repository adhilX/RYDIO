
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IjwtService } from "../../domain/interface/serviceInterface/IjwtService";
import { IrefreshTokenUseCase } from "../../domain/interface/usecaseInterface/auth/IrefreshTokenUseCase";

export class RefreshTokenUseCase implements IrefreshTokenUseCase {
    private jwtService: IjwtService
    private userRepository: IuserRepository
    private adminRepository: IadminRepository
    constructor(
        jwtService: IjwtService,
        userRepository: IuserRepository,
        adminRepository: IadminRepository
    ) {
        this.adminRepository = adminRepository
        this.userRepository = userRepository
        this.jwtService = jwtService
    }

    async execute(token: string): Promise<string> {
        const payload = this.jwtService.verifyRefreshToken(token, process.env.REFRESH_TOKEN_KEY as string)
        if (!payload) throw new Error('Invalid or Expired Refresh Token')
        console.log('refresh token here')
        const userId = payload.userId
        const client = await this.userRepository.findById(userId)
        const admin = await this.adminRepository.findById(userId)
        const user = client || admin
        const role = client ? 'user' : admin ? 'admin' : null;
        if (!user || !role) throw new Error('User Not Found')

        const newAccessToken = this.jwtService.createAccessToken(process.env.ACCESS_TOKEN_KEY as string,
            userId,
            role)

        return newAccessToken
    }
}