import { UnblockUserInputDto, UnblockUserOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IunblockUserUseCase{
    unblockUser(input: UnblockUserInputDto): Promise<UnblockUserOutputDto>
}