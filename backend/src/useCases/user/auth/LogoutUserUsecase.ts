    import { IjwtService } from "../../../domain/interface/serviceInterface/IjwtService";
import { IredisService } from "../../../domain/interface/serviceInterface/IredisService";
import { IuserLogoutUsecase } from "../../../domain/interface/usecaseInterface/user/authentication/IuserLogoutUsecase";

export class UserLogoutUseCase implements IuserLogoutUsecase {
    private redisService: IredisService
    private jwtService: IjwtService
    constructor(redisService: IredisService, jwtService: IjwtService) {
        this.redisService = redisService
        this.jwtService = jwtService
    }
    async clientLogout(token: string): Promise<boolean> {
        const decode = this.jwtService.tokenDecode(token)
        const exp = decode?.exp
        console.log(exp)
        if (!exp) throw new Error('Invalid Token')
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = exp - currentTime;
        console.log(ttl)
        if (ttl > 0) {
            await this.redisService.set(`blacklist:${token}`, ttl, 'true')
            return true
        }
        return false
    }
}