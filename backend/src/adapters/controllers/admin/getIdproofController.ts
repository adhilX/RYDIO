import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/entities/httpStatus";
import { IgetIdProofUscase } from "../../../domain/interface/usecaseInterface/admin/IgetIdProofUscase";

export class GetIdProofController {
    constructor(private _getIdProofUscase: IgetIdProofUscase) {
        this._getIdProofUscase = _getIdProofUscase;
    }

    async getIdProof(req: Request, res: Response): Promise<void> {
        try {
            const {status,currentPage,itemsPerPage} = req.body
            const vehicle = await this._getIdProofUscase.getIdProof(status,currentPage,itemsPerPage);
            res.status(HttpStatus.OK).json(vehicle);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while retrieving ID proof.',
                error: error instanceof Error ? error.message : String(error)
            });
            console.error('GetIdProofController.getIdProof error:', error);
        }
    }
}
