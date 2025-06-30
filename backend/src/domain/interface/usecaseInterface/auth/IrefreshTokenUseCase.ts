export interface IrefreshTokenUseCase{
    execute(token: string): Promise<string>
}