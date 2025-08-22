import { GetUserInputDto, GetUserOutputDto } from "../../DTOs/userDto/AuthDto";

export interface IGetUserUsecase {
    getUser(input: GetUserInputDto): Promise<GetUserOutputDto>;
}