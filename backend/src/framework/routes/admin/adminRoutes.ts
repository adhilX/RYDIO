import { Request, Response, Router } from "express";
import { adminLoginController, ApprovedVehiceController, blockUserController, getAllUserController, getBookingController, getIdProofController, getAdminWalletController, idProofActionController, pendingVehicleController, searchUserController, unblockUserController, vehicleUpproveController, vendorAccessController } from "../../DI/adminInject";
import { injectedVerfyToken, tokenTimeExpiryValidationMiddleware } from "../../DI/serviceInject";
import { checkRoleBaseMiddleware } from "../../../adapters/middlewares/checkRoleBasedMIddleware";
export class AdminRoutes {
    public AdminRoute: Router

    constructor() {
        this.AdminRoute = Router()
        this.setRoutes()
    }
    private setRoutes() {
        this.AdminRoute.post('/login', (req: Request, res: Response) => {
            adminLoginController.handleAdminLogin(req, res)
        })
        this.AdminRoute.get('/getusers', injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            getAllUserController.getAllUsers(req, res)
        })
        this.AdminRoute.patch('/userblock/:userId',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            blockUserController.handleClientBlock(req, res)
        })
        this.AdminRoute.patch('/unuserblock/:userId',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            unblockUserController.handleClientBlock(req, res)
        })
        this.AdminRoute.get('/searchuser',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            searchUserController.searchUser(req, res)
        })
        this.AdminRoute.get('/pending-vehicle',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            pendingVehicleController.approveVehicle(req, res)
        })
        this.AdminRoute.get('/aproved-vehicle',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            ApprovedVehiceController.approveVehicle(req, res)
        })
        this.AdminRoute.post('/vehicle-action/:id',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'), (req: Request, res: Response) => {
            vehicleUpproveController.approveVehicle(req, res)
        })
        this.AdminRoute.post('/get-idproof',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'),(req:Request,res:Response)=>{
            getIdProofController.getIdProof(req,res)
        })
        this.AdminRoute.post('/idproof-action/:id',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'),(req:Request,res:Response)=>{
           idProofActionController.idProofAction(req,res)
        })
        this.AdminRoute.patch('/vendor-access/:userId',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'),(req:Request,res:Response)=>{
           vendorAccessController.handleVendorAccess(req,res)
         })
        this.AdminRoute.post('/bookings',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'),(req:Request,res:Response)=>{
           getBookingController.getBookingData(req,res)
        })
        this.AdminRoute.get('/get-wallet',injectedVerfyToken, tokenTimeExpiryValidationMiddleware, checkRoleBaseMiddleware('admin'),(req:Request,res:Response)=>{
           getAdminWalletController.getWalletDetails(req,res)
        })

    }
}