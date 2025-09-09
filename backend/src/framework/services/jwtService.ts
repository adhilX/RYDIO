import { DecodedTokenEntity } from "../../domain/entities/decoderTokenEntities";
import { IJwtService } from "../../domain/interface/serviceInterface/IJwtService";
import jwt from 'jsonwebtoken'

export class JwtService implements IJwtService {
    createAccessToken(accessSecretKey: string, userId: string, role: string): string {
        return jwt.sign({ userId, role }, accessSecretKey, { expiresIn: '15m' })
    }

    createRefreshToken(refreshSecretKey: string, userId: string): string {
        return jwt.sign({ userId }, refreshSecretKey, { expiresIn: '1d' })
    }
    verifyAccessToken(accessToken: string, accessSecretKey: string) {
        try {
            return jwt.verify(accessToken, accessSecretKey) as { userId: string, role: string }
        } catch (error) {
            console.log('error while verify AccessToken ', error)
            return null
        }
    }
    verifyRefreshToken(refreshToken: string, refreshSecretKey: string): { userId: string; } | null {
        try {
            return jwt.verify(refreshToken, refreshSecretKey) as { userId: string }
        } catch {
            return null
        }
    }
    tokenDecode(accessToken: string): DecodedTokenEntity | null {
        return jwt.decode(accessToken) as DecodedTokenEntity
    }
}