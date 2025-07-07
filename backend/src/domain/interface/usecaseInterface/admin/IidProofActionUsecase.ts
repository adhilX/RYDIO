export interface IidProofActionUsecase {
    setAction(id:string,owner_id:string,action:'rejected'|'approved'):Promise<boolean>
}