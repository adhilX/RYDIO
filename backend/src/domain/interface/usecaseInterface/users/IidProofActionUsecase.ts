import { IdProofActionInputDto, IdProofActionOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IidProofActionUsecase {
    setAction(input: IdProofActionInputDto): Promise<IdProofActionOutputDto>
}