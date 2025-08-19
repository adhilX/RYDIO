import { GetIdProofInputDto, GetIdProofOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IgetIdProofUscase{
    getIdProof(input: GetIdProofInputDto): Promise<GetIdProofOutputDto | null>
}