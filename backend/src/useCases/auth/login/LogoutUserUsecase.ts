import { LogoutUserInputDto, LogoutUserOutputDto } from "../../../domain/interface/DTOs/userDto/AuthDto";
import { IjwtService } from "../../../domain/interface/serviceInterface/IjwtService";
import { IredisService } from "../../../domain/interface/serviceInterface/IredisService";
import { IuserLogoutUsecase } from "../../../domain/interface/usecaseInterface/auth/login/IuserLogoutUsecase";

export class UserLogoutUseCase implements IuserLogoutUsecase {
    private _redisService: IredisService
    private _jwtService: IjwtService
    constructor(redisService: IredisService, jwtService: IjwtService) {
        this._redisService = redisService
        this._jwtService = jwtService
    }
    async clientLogout(input: LogoutUserInputDto): Promise<LogoutUserOutputDto> {
        const { token } = input;
        const decode = this._jwtService.tokenDecode(token)
        const exp = decode?.exp
        console.log(exp)
        if (!exp) throw new Error('Invalid Token')
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = exp - currentTime;
        console.log(ttl)
        if (ttl > 0) {
            await this._redisService.set(`blacklist:${token}`, ttl, 'true')
            return {
                success: true,
                message: 'User logged out successfully'
            };
        }
        return {
            success: false,
            message: 'Token already expired'
        };
    }
}