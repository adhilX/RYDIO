import { VendorAccessInputDto, VendorAccessOutputDto } from "../../DTOs/adminDto/AdminDto";

export interface IVendorAccessUsecase {
    vendorAccess(input: VendorAccessInputDto): Promise<VendorAccessOutputDto>
}