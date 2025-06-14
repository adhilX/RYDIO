import { DecodedTokenEntity } from "../../entities/decoderTokenEntities";

export interface IjwtService{
    createAccessToken(accessSecretKey:string,userId:string,role:string):string
    createRefreshToken(refreshSecretKey:string,userId:string):string
    verifyAccessToken(accessToken:string,accessSecretKey:string):any
    verifyRefreshToken(refreshToken: string, refreshSecretKey: string): { userId: string } | null;
    tokenDecode(accessToken:string):DecodedTokenEntity | null
}