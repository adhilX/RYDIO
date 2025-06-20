export interface IunblockUserUseCase{
    unblockUser(userId:string):Promise<boolean>
}