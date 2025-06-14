import { User } from "./userEntities";

export interface ClientEnties extends User{
    clientId?: string
    googleVerification?: boolean
}