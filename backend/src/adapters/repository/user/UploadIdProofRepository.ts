import { IUploadIdProofRepository } from "../../../domain/interface/repositoryInterface/IUploadIdProofRepository";
import { verificationRequestModel } from "../../../framework/database/models/verificationRequestModel";
import { userModel } from "../../../framework/database/models/userModel";
import { User } from "../../../domain/entities/userEntities";

export class UploadIdProofRepository implements IUploadIdProofRepository {
    async uploadImg(idProofUrl: string, userId: string): Promise<User | null> {
        const result = await verificationRequestModel.create({ idProofUrl });
        return await userModel
            .findByIdAndUpdate(
                userId,
                { idproof_id: result._id },
                { new: true }
            ).populate('idproof_id');
    }
}