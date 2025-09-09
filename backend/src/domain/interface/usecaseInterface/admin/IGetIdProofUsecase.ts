import { User } from "../../../entities/userEntities";

export interface IGetIdProofUsecase{
getIdProof(status:'pending' | 'approved' | 'rejected',currentPage:number,itemsPerPage:number): Promise<{idproofs:User[];total:number} | null>}