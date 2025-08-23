import dotenv from 'dotenv'
dotenv.config()
import express, { Application, urlencoded } from 'express';
import { UserRoutes } from './framework/routes/user/userRoutes';
import { ConnectMongoDB } from './framework/database/databaseConnection/dbConnection';
import cors from 'cors';
import morgan from 'morgan'
import { AdminRoutes } from './framework/routes/admin/adminRoutes';
import redisService from './framework/services/redisService';
import { AuthRoute } from './framework/routes/auth/RefreshRoutes';
import cookieParser from 'cookie-parser'

export class App {
    private _app : Application                
    private port: number|string
    private database: ConnectMongoDB
    // private socketIoServer: SocketIoController
    constructor() {
        this._app = express();
        this._app.use(cors({
            origin: process.env.ORIGIN,
            credentials: true
        }))
        this.port = process.env.PORT || 3000;
        this.database = new ConnectMongoDB()
        this.connectRedis()
        this._app.use(morgan('dev'))
        this.database.connectDB()
        this._app.use(express.json());
        this._app.use(cookieParser())
        this._app.use(urlencoded({extended:true}));
        this.setAuthRoutes()
        this.setAdminRoutes();
        this.setUserRoutes();
        
    }

    public listen(): void {
        this._app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }   
    private setUserRoutes(){
        this._app.use('/',new UserRoutes().UserRoutes);
    }
    private setAdminRoutes(){
        this._app.use('/admin',new AdminRoutes().AdminRoute)
    }
    private setAuthRoutes(){
        this._app.use('/refresh-token',new AuthRoute().AuthRouter)
    }
       private async connectRedis() {
        await redisService.connect()
    }
    private setSocketIo() {
        // this.socketIoServer = new SocketIoController()
    }
}

const app = new App();
app.listen();