import { SearchUserInputDto, SearchUserOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface ISearchUserUsecase {
    searchUser(input: SearchUserInputDto): Promise<SearchUserOutputDto | null>
}