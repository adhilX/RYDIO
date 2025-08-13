
import { RefreshTokenInputDto, RefreshTokenOutputDto } from "../../domain/interface/DTOs/userDto/AuthDto";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IjwtService } from "../../domain/interface/serviceInterface/IjwtService";
import { IrefreshTokenUseCase } from "../../domain/interface/usecaseInterface/auth/IrefreshTokenUseCase";

export class RefreshTokenUseCase implements IrefreshTokenUseCase {
    private _jwtService: IjwtService
    private _userRepository: IuserRepository
    private _adminRepository: IadminRepository
    constructor(
        jwtService: IjwtService,
        userRepository: IuserRepository,
        adminRepository: IadminRepository
    ) {
        this._adminRepository = adminRepository
        this._userRepository = userRepository
        this._jwtService = jwtService
    }

    async execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
        const { token } = input;
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
        return {
            accessToken: newAccessToken
        }
    }
}