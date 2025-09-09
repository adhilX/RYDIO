import { UnblockUserInputDto, UnblockUserOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IUnblockUserUsecase {
    unblockUser(input: UnblockUserInputDto): Promise<UnblockUserOutputDto>
}