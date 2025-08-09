import { IjwtService } from "../../domain/interface/serviceInterface/IjwtService";
import { IredisService } from "../../domain/interface/serviceInterface/IredisService";
import { ItokenService } from "../../domain/interface/serviceInterface/ItokenService";

export class TokenService implements ItokenService{
    private _redisService: IredisService
    private _jwtService: IjwtService
    private _accessSecretKey: string
    constructor(redisService: IredisService, jwtService: IjwtService, accessSecretKey: string) {
        this._redisService = redisService
        this._jwtService = jwtService
        this._accessSecretKey = accessSecretKey
    }
    async checkTokenBlacklist(token: string): Promise<boolean> {
        const result = await this._redisService.get(`blacklist:${token}`)
        return !!result
    }

    verifyToken(token: string) {
        return this._jwtService.verifyAccessToken(token, this._accessSecretKey)
    }
}