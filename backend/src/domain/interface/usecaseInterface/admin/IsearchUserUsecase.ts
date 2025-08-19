import { SearchUserInputDto, SearchUserOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IsearchUserUsecase {
    searchUser(input: SearchUserInputDto): Promise<SearchUserOutputDto | null>
}