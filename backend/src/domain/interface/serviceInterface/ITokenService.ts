export interface ITokenService{
    checkTokenBlacklist(token: string): Promise<boolean>
    verifyToken(token: string): any
}