import dotenv from 'dotenv'
dotenv.config()
import express, { Application, Request, Response, NextFunction, urlencoded } from 'express';
import { createServer, Server } from 'http';
import { UserRoutes } from './framework/routes/user/userRoutes';
import { ConnectMongoDB } from './framework/database/databaseConnection/dbConnection';
import cors from 'cors';
import morgan from 'morgan'
import { AdminRoutes } from './framework/routes/admin/adminRoutes';
import redisService from './framework/services/redisService';
import { AuthRoute } from './framework/routes/auth/RefreshRoutes';
import cookieParser from 'cookie-parser'
import client, { Counter, Histogram } from 'prom-client';
import responseTime from 'response-time';
import { createLogger } from "winston";
import LokiTransport from "winston-loki";
import { ChatSocketIOAdapter } from './adapters/controllers/chat/chatSocketIOAdapter';
import { ChatRoutes } from './framework/routes/chat/chatRoutes';
import { NotificationRoutes } from './framework/routes/notification/notificationRoutes';
import path from 'path';
import { createMessageUseCase, createNotificationUsecase, updateLastMessageUseCase } from './framework/DI/chatInject';
import { userRepository } from './framework/DI/userInject';
import { createStream } from 'rotating-file-stream';
import { NotificationManagerAdapter } from './adapters/controllers/notification/NotificationSocketIOAdapter';
import { createhttpServer } from './httpServer';
import { createSocketIOServer } from './IO';


const options = {
  transports: [
    new LokiTransport({
        labels:{
            appName:'rydio'
        },
      host: "http://127.0.0.1:3100"
    })
  ]
};

const logger = createLogger(options);
logger.info("This is a test log");

export class App {
    private _app : Application                
    private port: number|string
    private database: ConnectMongoDB
    private socketIo?: ChatSocketIOAdapter
    private httpServer:Server

    constructor() {
        this._app = express();
        this.httpServer = createhttpServer(this._app)
        this._app.use(cors({
            origin: process.env.ORIGIN,
            credentials: true
        }))
        this.port = process.env.PORT || 3003;
        this.database = new ConnectMongoDB()
        this.connectRedis() 
        this._setLoggingMiddleware()
        this._app.use(morgan('dev'))
        this.database.connectDB()
        this._app.use(express.json());
        this._app.use(cookieParser())
        this._app.use(urlencoded({extended:true}));
        this.setResponseTime()
        this.prometheus()
        this.setSocketIo()
        this.setMetricsRoute()
        this.setAuthRoutes()
        this.setAdminRoutes();
        this.setUserRoutes();
        this.setChatRoutes();
        this.setNotificationRoutes();
        this.setErrorHandler()
    }

    private setErrorHandler(){
        this._app.use((err:Error, req:Request, res:Response, _next:NextFunction) => {
        logger.error("Unhandled error");
        res.status(500).send("Internal Server Error");
    })
    }
  
    public listen(): void {
        this.httpServer.listen(this.port, () => { 
            console.log(`Server is running on port ${this.port}`);
        });
    }   
    private setUserRoutes(){
        this._app.use('/api/v1',new UserRoutes().UserRoutes);
    }
    private setAdminRoutes(){
        this._app.use('/api/v1/admin',new AdminRoutes().AdminRoute)
    }
    private setAuthRoutes(){
        this._app.use('/api/v1/refresh-token',new AuthRoute().AuthRouter)
    }
    
    private setChatRoutes(){
        this._app.use('/api/v1/chat', new ChatRoutes().ChatRoutes);
    }

    private setNotificationRoutes(){
        this._app.use('/api/v1/notifications',  new NotificationRoutes().NotificationRoutes);
    }

    private setMetricsRoute(){
        this._app.get('/metrics',async(req,res)=>{
            res.setHeader('content-type',client.register.contentType)
            const metrics = await client.register.metrics()
            res.send(metrics)
        })
    }
       private async connectRedis() {
        await redisService.connect()
    }

    private prometheus(){
        const collectDefaultMetrics = client.collectDefaultMetrics
        collectDefaultMetrics({register:client.register})
    }
    private setResponseTime(){
        const reqResTime = new Histogram({
            name:'http_express_req_res_time',
            help:'this tells how much time is taken by req and res',
            labelNames:['method','route','status_code'],
            buckets:[1,50,100,200,300,400,500,600,700,800,900,1000,2000]
        })

     const totalReqCoounter = new Counter({
        name:'total_req',
        help:'tell total req',
    })

        this._app.use(responseTime((req,res,time)=>{
           totalReqCoounter.inc()
            reqResTime.labels({
                method:req.method,
                route:req.url,
                status_code:res.statusCode
            }).observe(time)
        }))
    }

    private _setLoggingMiddleware() {
        if (process.env.NODE_ENV === 'development') {
            this._app.use(morgan('combined'))
        } else if (process.env.NODE_ENV === 'production') {

            const accessLogs = createStream((time, index) => {
                if (!time) return path.join(__dirname, "logs", "accessLogs", "buffer.txt");
                return path.join(__dirname, "logs", "accessLogs", new Date().toDateString() + index + ".txt")
            }, {
                interval: '1d', 
                size: "100M",
                maxFiles: 10
            })

            const errorLogs = createStream((time, index) => {
                if (!time) return path.join(__dirname, "logs", "errorLogs", "buffer.txt");
                return path.join(__dirname, "logs", "errorLogs", new Date().toDateString() + index + ".txt")
            }, {
                interval: '1d',
                size: "100M",
                maxFiles: 10
            })

            // accesslogs middleware
            this._app.use(morgan('combined', { stream: accessLogs }))

            // error logs (skips if statuscode is less than 400)
            this._app.use(morgan('combined', { stream: errorLogs, skip: (req, res) => res.statusCode < 400 }))
        }
    }
    private setSocketIo(){
     const socketIOServer = createSocketIOServer(this.httpServer)
     // Initialize chat adapter
     new ChatSocketIOAdapter(createMessageUseCase, updateLastMessageUseCase,createNotificationUsecase,userRepository)
     // Initialize notification adapter with the Socket.IO server instance
     new NotificationManagerAdapter(socketIOServer)
    }
}

const app = new App();
app.listen();