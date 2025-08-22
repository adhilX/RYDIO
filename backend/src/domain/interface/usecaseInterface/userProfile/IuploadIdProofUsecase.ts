import { UploadIdProofInputDto, UploadIdProofOutputDto } from "../../DTOs/userDto/UserProfileDto";

export interface IuploadIdProofUsecase{
    uploadProof(input: UploadIdProofInputDto): Promise<UploadIdProofOutputDto | null>
}