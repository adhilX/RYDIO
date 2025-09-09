import { UploadIdProofInputDto, UploadIdProofOutputDto } from "../../DTOs/userDto/UserProfileDto";

export interface IUploadIdProofUsecase{
    uploadProof(input: UploadIdProofInputDto): Promise<UploadIdProofOutputDto | null>
}