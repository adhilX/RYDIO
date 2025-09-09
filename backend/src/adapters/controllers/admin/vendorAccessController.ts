import { Request, Response } from "express"
import { HttpStatus } from "../../../domain/entities/httpStatus"
import { IVendorAccessUsecase } from "../../../domain/interface/usecaseInterface/admin/IVendorAccessUsecase"

export class VendorAccessController {
    private _vendorAccessUsecase: IVendorAccessUsecase
    constructor(vendorAccessUsecase: IVendorAccessUsecase) {
        this._vendorAccessUsecase = vendorAccessUsecase
    }

    async handleVendorAccess(req:Request,res:Response) {
        try {
            const {userId} = req.params
            const {vendorAccess} = req.body
            const response = await this._vendorAccessUsecase.vendorAccess({userId,vendorAccess})
           res.status(HttpStatus.OK).json(response)
        } catch (error) {
            console.log('error while blocking user', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'error while blocking user',
                error: error instanceof Error ? error.message : 'error while blocking user'
            })
        }
    }
}