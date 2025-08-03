import { AdminLoginController } from "../../adapters/controllers/admin/AdminLoginController";
import { BlockUserController } from "../../adapters/controllers/admin/BlockUsersController";
import { GetBookingController } from "../../adapters/controllers/admin/bookingMangment/GetBookingController";
import { GetAllUserController } from "../../adapters/controllers/admin/GetAllUserController";
import { GetIdProofController } from "../../adapters/controllers/admin/getIdproofController";
import { IdProofActionController } from "../../adapters/controllers/admin/idProofActionController";
import { SearchUserController } from "../../adapters/controllers/admin/SearchUserController";
import { UnblockUserController } from "../../adapters/controllers/admin/UnblockUserController";
import { GetApprovedVehicleController } from "../../adapters/controllers/admin/vehicleManagment/getApproveVehicleContorller";
import { PendingVehicleController } from "../../adapters/controllers/admin/vehicleManagment/PendingVehilcleContorller";
import { VehicleUpproveController } from "../../adapters/controllers/admin/vehicleManagment/VehicleUpproveController";
import { VendorAccessController } from "../../adapters/controllers/admin/vendorAccessController";
import { AdminRepository } from "../../adapters/repository/admin/adminRepository";
import { BookingRepository } from "../../adapters/repository/booking/bookingRepository";
import { VehicleRepository } from "../../adapters/repository/user/vehicleRepository";
import { LoginAdminUsecase } from "../../useCases/admin/AdminLoginUsecase";
import { BlockUserUseCase } from "../../useCases/admin/BlockUserUsecase";
import { GetBookingUsecase } from "../../useCases/admin/bookingMangment/getBookingUsecase";
import { GetAllUserUsecase } from "../../useCases/admin/getAllUserUsecase";
import { GetIdProofUscase } from "../../useCases/admin/getIdProofUscase";
import { IdProofActionUsecase } from "../../useCases/admin/idProofActionUsecase";
import { SearchUserusercase } from "../../useCases/admin/searchUserUsecase";
import { UnblockUserUseCase } from "../../useCases/admin/UnblockUserUsecase";
import { ApprovedVehicleusercase } from "../../useCases/admin/vehicleManagment/ApprovedVehiceUsecase";
import { PendingVehicleusercase } from "../../useCases/admin/vehicleManagment/PendingVehicleUsecase";
import { VehicleUpproveUsecase } from "../../useCases/admin/vehicleManagment/vehicleApproveUsecase";
import { VendorAccessUsecase } from "../../useCases/admin/vendorAccessUsecase";
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

//------approve vehicle--------
const vehicleRepository = new VehicleRepository()
const vehicleUpproveUsecase = new VehicleUpproveUsecase(vehicleRepository)
export const vehicleUpproveController = new VehicleUpproveController(vehicleUpproveUsecase)

//-------fetch pending vehicle------
const pendingVehicleUsecase = new PendingVehicleusercase(adminRepository)
export const pendingVehicleController = new PendingVehicleController(pendingVehicleUsecase)

//-------fetch vehicle------

const approvedVehicleUsecase = new ApprovedVehicleusercase(adminRepository)
export const ApprovedVehiceController = new GetApprovedVehicleController(approvedVehicleUsecase)

//-----fetch id Proof-------------
const getIdProofUscase = new GetIdProofUscase(adminRepository)
export const getIdProofController = new GetIdProofController(getIdProofUscase)

//------ id proof action-----------

const idProofActionUsecase = new IdProofActionUsecase(adminRepository)
export const idProofActionController = new IdProofActionController(idProofActionUsecase)

//-------vendor access--------

const vendorAccessUsecase = new VendorAccessUsecase(adminRepository)
export const vendorAccessController = new VendorAccessController(vendorAccessUsecase)


//-------get booking data--------
const bookingRepository = new BookingRepository()
const getBookingUsecase = new GetBookingUsecase(bookingRepository)
export const getBookingController = new GetBookingController(getBookingUsecase)
