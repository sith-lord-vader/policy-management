import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import {createServer, Server} from "http"
import apiRouter from "./routes/api";
import bodyParser from "body-parser";
import sprintDataSource from "./db";

dotenv.config()

const App: Express = express()
const server: Server = createServer(App)

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));

App.get('/', (req: Request, res: Response) => {
    res.redirect("/api/v1/")
})
App.use("/api/v1", apiRouter)

sprintDataSource.initialize().then(() => {
    server.listen(9000, () => {
        console.log("server is Up!")
    })
}).catch((e) => {
    console.error(e)
})

