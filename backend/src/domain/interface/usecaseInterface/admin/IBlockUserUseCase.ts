export interface IblockUserUseCase{
    blockUser(userId:string):Promise<boolean>
}