import express, { Request, Response, Router } from "express";
import { Repository } from "typeorm";
import sprintDataSource from "../../db";
import Employee from "../../models/employee";
import Policy from "../../models/policy";
import PolicyAck from "../../models/policy-acknowledgement";

const policyAckRepo: Repository<PolicyAck> =
  sprintDataSource.getRepository(PolicyAck);
const policyRepo: Repository<Policy> = sprintDataSource.getRepository(Policy);
const employeeRepo: Repository<Employee> =
  sprintDataSource.getRepository(Employee);
const policyAckRouter: Router = express.Router();

interface policyAckData {
  employeeId: number;
  policyId: number;
  newJoinee: boolean;
}
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
    const policy: Policy | null = await policyRepo.findOne({
      where: {
        id: data.policyId,
      },
      relations: ["isApproved"],
    });
    if (!policy) {
      res.status(400).send("Policy not found!");
      return;
    }

    // If not approved return here
    if (!policy.isApproved) {
      res.status(400).send("Policy not yet approved");
      return;
    }

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

interface policyAckAckData {
  employeeId: number;
  ackId: number;
}
policyAckRouter.post("/ack", async (req: Request, res: Response) => {
  try {
    const data: policyAckAckData = req.body;

    const policyAck: PolicyAck | null = await policyAckRepo.findOne({
      where: { id: data.ackId, employee: { id: data.employeeId } },
      relations: ["employee"],
    });
    if (!policyAck) {
      res.status(400).send("Ack request not found");
      return;
    }

    policyAck.acked = true;
    const currentDate = new Date();
    policyAck.ackedOn = currentDate;

    await policyAckRepo.save(policyAck);
    res.send(policyAck);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
    return;
  }
});

policyAckRouter;

export default policyAckRouter;
