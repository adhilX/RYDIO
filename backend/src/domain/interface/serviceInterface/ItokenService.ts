export interface ItokenService{
    checkTokenBlacklist(token: string): Promise<boolean>
    verifyToken(token: string): any
}