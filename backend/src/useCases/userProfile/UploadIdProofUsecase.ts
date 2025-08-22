import { User } from "../../domain/entities/userEntities";
import { IUploadIdProofRepository } from "../../domain/interface/repositoryInterface/IUploadIdProofRepository";
import { IuploadIdProofUsecase } from "../../domain/interface/usecaseInterface/userProfile/IuploadIdProofUsecase";
import { UploadIdProofInputDto, UploadIdProofOutputDto } from "../../domain/interface/DTOs/userDto/UserProfileDto";

export class UploadIdProofUsecase implements IuploadIdProofUsecase{

    private _uploadIdProofRepository :IUploadIdProofRepository

    constructor(uploadIdProofRepository:IUploadIdProofRepository){
        this._uploadIdProofRepository= uploadIdProofRepository
    }
    
    async uploadProof(input: UploadIdProofInputDto): Promise<UploadIdProofOutputDto | null> {
        try {
            const { userId, imageUrl } = input;
            const updatedUser = await this._uploadIdProofRepository.uploadImg(imageUrl, userId);
            
            if (!updatedUser) {
                throw new Error("User not found or upload failed");
            }
            
            return {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                isVerified: updatedUser.is_verified_user || false,
                isBlocked: updatedUser.is_blocked || false,
                role: updatedUser.role,
                idProofUrl: imageUrl,
                verificationStatus: 'pending',
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        } catch (error) {
            console.error('Error in UploadIdProofUsecase:', error);
            throw error;
        }
    }

}