import dotenv from 'dotenv'
dotenv.config({ path: '../../.env'})

import mongoose from "mongoose";
export class ConnectMongoDB {
    private databaseURL: string;
    constructor(){
        if(!process.env.MONGODB_URL) throw new Error('mongodb url is not avilable')
            else this.databaseURL = process.env.MONGODB_URL
    }
   
   async connectDB(){
       try {
           await mongoose.connect(this.databaseURL)
           console.log('db connected')
       } catch (error) {
        console.log(error)
       }
    }
}