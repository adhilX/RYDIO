import { CreateUserInputDto, CreateUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IcreateUserUsecase{
createUser(payload: CreateUserInputDto): Promise<CreateUserOutputDto | null>}