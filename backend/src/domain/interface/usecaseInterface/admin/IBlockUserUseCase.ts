import { BlockUserInputDto, BlockUserOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IBlockUserUseCase{
    blockUser(input: BlockUserInputDto): Promise<BlockUserOutputDto>
}