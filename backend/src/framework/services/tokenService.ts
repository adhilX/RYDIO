import { IjwtService } from "../../domain/interface/serviceInterface/IjwtService";
import { IredisService } from "../../domain/interface/serviceInterface/IredisService";
import { ItokenService } from "../../domain/interface/serviceInterface/ItokenService";

export class TokenService implements ItokenService{
    private redisService: IredisService
    private jwtService: IjwtService
    private accessSecretKey: string
    constructor(redisService: IredisService, jwtService: IjwtService, accessSecretKey: string) {
        this.redisService = redisService
        this.jwtService = jwtService
        this.accessSecretKey = accessSecretKey
    }
    async checkTokenBlacklist(token: string): Promise<boolean> {
        const result = await this.redisService.get(`blacklist:${token}`)
        return !!result
    }

    verifyToken(token: string) {
        return this.jwtService.verifyAccessToken(token, this.accessSecretKey)
    }
}