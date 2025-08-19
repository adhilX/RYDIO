import { GetAllUsersInputDto, GetAllUsersOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IgetAllUserUsecase{
    getAllUser(input?: GetAllUsersInputDto): Promise<GetAllUsersOutputDto | null>
}