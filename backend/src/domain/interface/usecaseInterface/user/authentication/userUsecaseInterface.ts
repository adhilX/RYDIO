import { CreateUserInputDto, CreateUserOutputDto } from "../../../DTOs/userDto/createUserDto";

export interface IcreateUserUsecase{
createUser(payload: CreateUserInputDto): Promise<CreateUserOutputDto | null>}