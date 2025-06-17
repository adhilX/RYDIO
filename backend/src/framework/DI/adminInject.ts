import { AdminLoginController } from "../../adapters/controllers/admin/AdminLoginController";
import { GetAllUserController } from "../../adapters/controllers/admin/GetAllUserController";
import { AdminRepository } from "../../adapters/repository/admin/adminRepository";
import { LoginAdminUsecase } from "../../useCases/admin/AdminLoginUsecase";
import { GetAllUserUsecase } from "../../useCases/admin/getAllUserUsecase";

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