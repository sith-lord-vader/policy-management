import express, { Request, Response, Router } from "express";
import { Repository } from "typeorm";
import sprintDataSource from "../../db";
import Employee from "../../models/employee";
import Policy from "../../models/policy";
import PolicyAck from "../../models/policy-acknowledgement";

interface policyAckData {
  employeeId: number;
  policyId: number;
  newJoinee: boolean;
}

const policyAckRepo: Repository<PolicyAck> =
  sprintDataSource.getRepository(PolicyAck);
const policyRepo: Repository<Policy> = sprintDataSource.getRepository(Policy);
const employeeRepo: Repository<Employee> =
  sprintDataSource.getRepository(Employee);
const policyAckRouter: Router = express.Router();

policyAckRouter.post("/", async (req: Request, res: Response) => {
  const data: policyAckData = req.body;
  try {
    const employee: Employee | null = await employeeRepo.findOneBy({
      id: data.employeeId,
    });
    if (!employee) {
      res.status(400).send("Employee not found!");
      return;
    }
    const policy: Policy | null = await policyRepo.findOneBy({
      id: data.policyId,
    });
    if (!policy) {
      res.status(400).send("Policy not found!");
      return;
    }
    // If not approved return here
    const newPolicyAck = new PolicyAck();
    newPolicyAck.employee = employee;
    newPolicyAck.policy = policy;
    newPolicyAck.newJoinee = data.newJoinee;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + policy.duration);
    newPolicyAck.expiresOn = futureDate;
    await policyAckRepo.save(newPolicyAck);
    res.send(newPolicyAck);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default policyAckRouter;
