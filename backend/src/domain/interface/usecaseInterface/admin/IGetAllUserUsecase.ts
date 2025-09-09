import { GetAllUsersOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IGetAllUserUsecase{
    // getAllUser(input?: GetAllUsersInputDto): Promise<GetAllUsersOutputDto | null>
    getAllUser(): Promise<GetAllUsersOutputDto | null>
}