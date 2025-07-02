import { Request, Response, Router } from "express";
import { adminLoginController, ApprovedVehiceController, blockUserController, getAllUserController, pendingVehicleController, searchUserController, unblockUserController, vehicleUpproveController } from "../../DI/adminInject";
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
        this.AdminRoute.patch('/userblock/:userId', (req: Request, res: Response) => {
            blockUserController.handleClientBlock(req, res)
        })
        this.AdminRoute.patch('/unuserblock/:userId', (req: Request, res: Response) => {
            unblockUserController.handleClientBlock(req, res)
        })
        this.AdminRoute.get('/searchuser', (req: Request, res: Response) => {
            searchUserController.searchUser(req, res)
        })
        this.AdminRoute.get('/pending-vehicle', (req: Request, res: Response) => {
            pendingVehicleController.approveVehicle(req, res)
        })
        this.AdminRoute.get('/aproved-vehicle', (req: Request, res: Response) => {
            ApprovedVehiceController.approveVehicle(req, res)
        })
        this.AdminRoute.post('/vehicle-upprove/:id', (req: Request, res: Response) => {
            vehicleUpproveController.approveVehicle(req, res)
        })

    }
}