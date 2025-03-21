import express, { Request, Response, Router } from "express";
import { Repository } from "typeorm";
import sprintDataSource from "../../db";
import Employee from "../../models/employee";
import Policy from "../../models/policy";

interface policyData {
  title: string;
  content: string;
  templateId: number;
  createdBy: number;
  duration: number;
}

const policyRepo: Repository<Policy> = sprintDataSource.getRepository(Policy);
const employeeRepo: Repository<Employee> =
  sprintDataSource.getRepository(Employee);
const policyRouter: Router = express.Router();

policyRouter.get("/:policyId", async (req: Request, res: Response) => {
  try {
    let policyId: undefined | number = undefined;
    try {
      policyId = parseInt(req.params.policyId);
    } catch (error) {
      res.status(400).send("Policy Id must be a number");
    }
    const ourPolicy = await policyRepo.findOne({
      where: { id: policyId },
      relations: ["createdBy", "isApproved"],
    });
    console.log(ourPolicy?.createdBy.id);
    if (ourPolicy) {
      res.send(ourPolicy);
      return;
    }
    res.status(404).send("Policy not on the database");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

policyRouter.post(
  "/duplicate/:policyId",
  async (req: Request, res: Response) => {
    try {
      let policyId: undefined | number = undefined;
      try {
        policyId = parseInt(req.params.policyId);
      } catch (error) {
        res.status(400).send("Policy Id must be a number");
      }
      const ourPolicy = await policyRepo.findOne({
        where: { id: policyId },
        relations: ["createdBy", "isApproved"],
      });

      if (!ourPolicy) {
        res.status(404).send("Policy not on the database");
        return;
      }

      const newPolicy = new Policy();
      newPolicy.title = ourPolicy.title;
      newPolicy.content = ourPolicy.content;
      newPolicy.templateId = ourPolicy.templateId;
      newPolicy.duration = ourPolicy.duration;
      newPolicy.copyOf = ourPolicy;

      await policyRepo.save(newPolicy);
      res.send(ourPolicy);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

policyRouter.post("/", async (req: Request, res: Response) => {
  const data: policyData = req.body;

  try {
    const newPolicy = new Policy();
    newPolicy.title = data.title;
    newPolicy.content = data.content;
    newPolicy.templateId = data.templateId;
    newPolicy.duration = data.duration;
    console.log(data.createdBy);
    const createByEmployee: Employee | null = await employeeRepo.findOneBy({
      id: data.createdBy,
    });
    console.log(createByEmployee, "dasasd");
    if (createByEmployee) {
      newPolicy.createdBy = createByEmployee;
      await policyRepo.save(newPolicy);
      res.send(newPolicy);
      return;
    }
    res.status(400).send("Employee ID not found!");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default policyRouter;
