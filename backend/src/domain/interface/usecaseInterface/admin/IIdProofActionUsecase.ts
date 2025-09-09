import { IdProofActionInputDto, IdProofActionOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IIdProofActionUsecase {
    setAction(input: IdProofActionInputDto): Promise<IdProofActionOutputDto>
}