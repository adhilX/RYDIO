import { RefreshTokenInputDto, RefreshTokenOutputDto } from "../../DTOs/userDto/AuthDto";

export interface IrefreshTokenUseCase{
    execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto>
}