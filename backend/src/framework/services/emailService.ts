import { IemailServise } from "../../domain/interface/serviceInterface/IemailService";
import nodemailer from 'nodemailer'
import { otpTemplate } from "../../shared/templates/otpTemplates";

export class EmailService implements IemailServise {
  private _transporter: nodemailer.Transporter;

   constructor(){
    this._transporter = nodemailer.createTransport({
        service : 'gmail',
        auth:{
            user : process.env.EMAIL_ID,
            pass: process.env.PASS
        }
    })
   }
    async sendOtp(email: string, otp: string): Promise<void> {
        // console.log(email,'ehhhhhhhhhhhhhhhhhhhhh')
        const mailOption= {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your otp code',
            html: otpTemplate(otp)
        }
        try {
            await this._transporter.sendMail(mailOption)
            console.log(`otp sended to ${email}`)
        } catch (error) {
            console.log('error while sending otp',error)
            throw new Error('failed to send otp')
        }
    }
}