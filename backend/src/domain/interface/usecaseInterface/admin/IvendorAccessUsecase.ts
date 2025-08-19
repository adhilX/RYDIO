import { VendorAccessInputDto, VendorAccessOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IvendorAccessUsecase {
    vendorAccess(input: VendorAccessInputDto): Promise<VendorAccessOutputDto>
}