import { User } from "../../domain/entities/userEntities";
import { IadminRepository } from "../../domain/interface/repositoryInterface/IadminRepository";
import { IgetIdProofUscase } from "../../domain/interface/usecaseInterface/admin/IgetIdProofUscase";
import { GetIdProofInputDto, GetIdProofOutputDto, BaseUserOutputDto } from "../../domain/interface/DTOs/adminDto/AdminDto";

export class GetIdProofUscase implements IgetIdProofUscase{
    constructor(private _adminRepository :IadminRepository){
        this._adminRepository = _adminRepository
    }
async getIdProof(input: GetIdProofInputDto): Promise<GetIdProofOutputDto | null> {
  const {idProof,total}  = await this._adminRepository.getIdProof(input.status, input.currentPage, input.itemsPerPage)?? {idProof: [], total: 0,}; ;
  const ids = idProof.map((proof) => proof._id!.toString());
  
   const users =  await this._adminRepository.findByIdProof(ids);
   const mappedUsers: BaseUserOutputDto[] = users.map((user: User) => {
      const plainUser = JSON.parse(JSON.stringify(user))
      const { password, ...rest } = plainUser
      return {
          _id: rest._id,
          email: rest.email,
          name: rest.name,
          phone: rest.phone,
          role: rest.role,
          is_blocked: rest.is_blocked,
          is_verified_user: rest.is_verified_user,
          last_login: rest.last_login,
          vendor_access: rest.vendor_access,
          googleVerification: rest.googleVerification,
          profile_image: rest.profile_image,
          createdAt: rest.createdAt,
          updatedAt: rest.updatedAt
      };
    });
   return {idproofs: mappedUsers, total}
}
}