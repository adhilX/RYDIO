import { IJwtService } from "../../domain/interface/serviceInterface/IJwtService";
import { IRedisService } from "../../domain/interface/serviceInterface/IRedisService";
import { ITokenService } from "../../domain/interface/serviceInterface/ITokenService";

export class TokenService implements ITokenService{
    private _redisService: IRedisService
    private _jwtService: IJwtService
    private _accessSecretKey: string
    constructor(redisService: IRedisService, jwtService: IJwtService, accessSecretKey: string) {
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