import express, { Request, Response, Router } from "express";
import approvalRouter from "./approval";
import employeeRouter from "./employee";
import policyRouter from "./policy";
import policyAckRouter from "./policy-acknowledgement";

interface employeeData {
  fullname: string;
  email: string;
  phoneno: string;
  address: string;
}

const apiRouter: Router = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send("Health OK!");
});

apiRouter.use("/employee", employeeRouter);
apiRouter.use("/policy", policyRouter);
apiRouter.use("/policy-ack", policyAckRouter);
apiRouter.use("/approval", approvalRouter);

export default apiRouter;
