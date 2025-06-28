import { User } from "../../domain/entities/userEntities";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IhashPassword } from "../../domain/interface/serviceInterface/IhashPassword";
import { IChangePasswordUsecase } from "../../domain/interface/usecaseInterface/user/userProfile/IchangePasswordUsercase";

export class ChangePassword implements IChangePasswordUsecase{
    private userRepository:IuserRepository
    private hashPassword :IhashPassword
    constructor(userRepository:IuserRepository,hashPassword:IhashPassword){
        this.userRepository =userRepository
        this.hashPassword = hashPassword
    }
        
    async handleChangePassword(newPassword: { current: string, newPass: string, confirm: string,_id:string }): Promise<User| null> {
        const { current, newPass , _id } = newPassword
        const user = await this.userRepository.findById(_id)
        if(!user?.password)throw new Error('user not found')
           
        const verifyPass = await this.hashPassword.comparePassword(current,user.password)
        if(!verifyPass) throw new Error('current password not match')
        if (current === newPass) throw new Error('New password must be different from the current password');
        const updatedUser = await this.userRepository.changePassword(_id,newPass)
        
        return updatedUser;
    }
}
