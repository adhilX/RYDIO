import dotenv from 'dotenv'
dotenv.config()
import express, { Application, urlencoded } from 'express';
import { UserRoutes } from './framework/routes/user/userRoutes';
import { ConnectMongoDB } from './framework/database/databaseConnection/dbConnection';
import cors from 'cors';
import morgan from 'morgan'
import { AdminRoutes } from './framework/routes/admin/adminRoutes';
import redisService from './framework/services/redisService';

export class App {
    private app : Application                
    private port: number|string
    private database: ConnectMongoDB
    constructor() {
        this.app = express();
        this.app.use(cors({
            origin: process.env.ORIGIN,
            credentials: true
        }))
        this.port = process.env.PORT || 3000;
        this.database = new ConnectMongoDB()
        this.connectRedis()
        this.database.connectDB()
        this.app.use(express.json());
        this.app.use(urlencoded({extended:true}));
        this.app.use(morgan('dev'))
        this.setUserRoutes();
        this.setAdminRoutes()
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }   
    private setUserRoutes(){
        this.app.use('/',new UserRoutes().UserRoutes);
    }
    private setAdminRoutes(){
        this.app.use('/admin',new AdminRoutes().AdminRoute)
    }
       private async connectRedis() {
        await redisService.connect()
    }
}

const app = new App();
app.listen();