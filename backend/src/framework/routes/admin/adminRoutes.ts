import { Request, Response, Router } from "express";
import { adminLoginController, ApprovedVehiceController, blockUserController, getAllUserController, getBookingController, getIdProofController, getAdminWalletController, idProofActionController, pendingVehicleController, searchUserController, unblockUserController, vehicleUpproveController, vendorAccessController, dashboardController, adminReportController } from "../../DI/adminInject";
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
        //========MIDDLEWARE==========
        this.AdminRoute.use(injectedVerfyToken,tokenTimeExpiryValidationMiddleware,checkRoleBaseMiddleware('admin'))
       
        this.AdminRoute.get('/getusers', (req: Request, res: Response) => {
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
        this.AdminRoute.post('/vehicle-action/:id', (req: Request, res: Response) => {
            vehicleUpproveController.approveVehicle(req, res)
        })
        this.AdminRoute.post('/get-idproof', (req: Request, res: Response) => {
            getIdProofController.getIdProof(req,res)
        })
        this.AdminRoute.post('/idproof-action/:id', (req:Request,res:Response)=>{
           idProofActionController.idProofAction(req,res)
        })
        this.AdminRoute.patch('/vendor-access/:userId', (req:Request,res:Response)=>{
           vendorAccessController.handleVendorAccess(req,res)
         })
        this.AdminRoute.post('/bookings', (req:Request,res:Response)=>{
           getBookingController.getBookingData(req,res)
        })
        this.AdminRoute.get('/get-wallet', (req:Request,res:Response)=>{
           getAdminWalletController.getWalletDetails(req,res)
        })

        // Dashboard Routes
        this.AdminRoute.get('/dashboard/revenue', (req: Request, res: Response) => {
            dashboardController.getTotalRevenue(req, res)
        })
        this.AdminRoute.get('/dashboard/bookings', (req: Request, res: Response) => {
            dashboardController.getTotalBookings(req, res)
        })
        this.AdminRoute.get('/dashboard/users', (req: Request, res: Response) => {
            dashboardController.getTotalUsers(req, res)
        })
        this.AdminRoute.get('/dashboard/vehicles', (req: Request, res: Response) => {
            dashboardController.getActiveVehicles(req, res)
        })
        this.AdminRoute.get('/dashboard/financial-overview', (req: Request, res: Response) => {
            dashboardController.getFinancialOverview(req, res)
        })
        this.AdminRoute.get('/dashboard/user-management', (req: Request, res: Response) => {
            dashboardController.getUserManagementStats(req, res)
        })
        this.AdminRoute.get('/dashboard/vehicle-management', (req: Request, res: Response) => {
            dashboardController.getVehicleManagementStats(req, res)
        })
        this.AdminRoute.get('/dashboard/booking-analytics', (req: Request, res: Response) => {
            dashboardController.getBookingAnalytics(req, res)
        })

        // Report Routes
        this.AdminRoute.get('/reports/all', (req: Request, res: Response) => {
            adminReportController.getAllReports(req, res)
        })
        this.AdminRoute.get('/reports/stats', (req: Request, res: Response) => {
            adminReportController.getReportsStats(req, res)
        })
        this.AdminRoute.get('/reports/:reportId', (req: Request, res: Response) => {
            adminReportController.getReportById(req, res)
        })
        this.AdminRoute.patch('/reports/:reportId/status', (req: Request, res: Response) => {
            adminReportController.updateReportStatus(req, res)
        })
        this.AdminRoute.post('/send-notification', (req: Request, res: Response) => {
            adminReportController.sendNotification(req, res)
        })
    }
}