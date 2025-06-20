import { AdminLoginController } from "../../adapters/controllers/admin/AdminLoginController";
import { BlockUserController } from "../../adapters/controllers/admin/BlockUsersController";
import { GetAllUserController } from "../../adapters/controllers/admin/GetAllUserController";
import { SearchUserController } from "../../adapters/controllers/admin/SearchUserController";
import { UnblockUserController } from "../../adapters/controllers/admin/UnblockUserController";
import { AdminRepository } from "../../adapters/repository/admin/adminRepository";
import { LoginAdminUsecase } from "../../useCases/admin/AdminLoginUsecase";
import { BlockUserUseCase } from "../../useCases/admin/BlockUserUsecase";
import { GetAllUserUsecase } from "../../useCases/admin/getAllUserUsecase";
import { SearchUserusercase } from "../../useCases/admin/searchUserUsecase";
import { UnblockUserUseCase } from "../../useCases/admin/UnblockUserUsecase";

import { HashPassword } from "../services/hashPassword";
import { JwtService } from "../services/jwtService";


//-----------admin login------------
const adminRepository = new AdminRepository()
const hashPassword = new HashPassword()
const jwtService = new JwtService()
const loginAdminUsecase = new LoginAdminUsecase(adminRepository,hashPassword)
export const adminLoginController = new AdminLoginController(loginAdminUsecase,jwtService)


//------get All Usersss-------------
const getAllUserUsecase = new GetAllUserUsecase(adminRepository)
export const getAllUserController = new GetAllUserController(getAllUserUsecase)

//------block user------------

const blockUserUseCase = new BlockUserUseCase(adminRepository)
export const blockUserController = new BlockUserController(blockUserUseCase)

//--------unblock user-----------
const unblockUserUseCase = new UnblockUserUseCase(adminRepository)
export const unblockUserController = new UnblockUserController(unblockUserUseCase)

//-----search user----------

const searchUserusercase = new SearchUserusercase(adminRepository)
export const searchUserController = new SearchUserController(searchUserusercase)