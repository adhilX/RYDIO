import { createServer, Server } from "http";
import { Application } from "express";

export let  httpserver: Server;

export const createhttpServer = (app:Application) => {
    httpserver = createServer(app)
    return httpserver
}

export const getHttpServer = () => {
    if(!httpserver){
        throw new Error("Http server not found")
    }
    return httpserver
}