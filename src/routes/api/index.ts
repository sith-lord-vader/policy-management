import express, {Request, Response, Router} from "express"
import sprintDataSource from "../../db"
import Employee from "../../models/employee"
import employeeRouter from "./employee"
import policyRouter from "./policy"

interface employeeData {
    fullname: string
    email: string
    phoneno: string
    address: string
}

const apiRouter: Router = express.Router()

apiRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send("Health OK!")
})

apiRouter.use("/employee", employeeRouter)
apiRouter.use("/policy", policyRouter)

export default apiRouter