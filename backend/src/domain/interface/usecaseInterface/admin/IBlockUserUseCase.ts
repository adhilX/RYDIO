import { BlockUserInputDto, BlockUserOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IblockUserUseCase{
    blockUser(input: BlockUserInputDto): Promise<BlockUserOutputDto>
}