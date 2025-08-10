import axiosInstance from "@/axios/Instance"

export const getIdProof=async(status:string,currentPage=1,itemsPerPage=6)=>{
    try {
        const response = await axiosInstance.post('/admin/get-idproof',{status,currentPage,itemsPerPage})
        return response.data
    } catch (error) {
        console.log('Error while fetching idproof:', error);
    throw error;
    }
}

export const actionIdProof=async(id:string, owner_id:string, action:'approved'|'rejected', reason?: string)=>{
    try {
        const response = await axiosInstance.post(`/admin/idproof-action/${id}`,{
            action,
            owner_id,
            ...(action === 'rejected' && reason && { reason })
        })
        return response.data
    } catch (error) {
        console.log('Error while idproof action:', error);
    throw error;
    }
}