export interface IRefreshTokenUseCase{
    execute(token: string): Promise<string>
}