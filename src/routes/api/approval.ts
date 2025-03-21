import express, { Request, Response, Router } from "express";
import { Repository } from "typeorm";
import sprintDataSource from "../../db";
import Approval from "../../models/approval";
import Employee from "../../models/employee";
import Policy from "../../models/policy";
import PolicyAck from "../../models/policy-acknowledgement";

const approvalRepo: Repository<Approval> =
  sprintDataSource.getRepository(Approval);
const policyRepo: Repository<Policy> = sprintDataSource.getRepository(Policy);
const policyAckRepo: Repository<PolicyAck> =
  sprintDataSource.getRepository(PolicyAck);
const employeeRepo: Repository<Employee> =
  sprintDataSource.getRepository(Employee);
const approvalRouter: Router = express.Router();

approvalRouter.post(
  "/:policyId/:employeeId",
  async (req: Request, res: Response) => {
    try {
      const policyId = parseInt(req.params.policyId);
      const employeeId = parseInt(req.params.employeeId);

      const policy = await policyRepo.findOne({
        where: { id: policyId },
        relations: ["copyOf"],
      });
      if (!policy) {
        res.status(400).send("Policy not found!");
        return;
      }

      const employee = await employeeRepo.findOneBy({ id: employeeId });
      if (!employee) {
        res.status(400).send("Employee not found!");
        return;
      }

      const approval = new Approval();
      approval.employee = employee;

      await approvalRepo.save(approval);

      try {
        policy.isApproved = approval;
        await policyRepo.save(policy);
      } catch (error) {
        console.error(error);
        await approvalRepo.delete(approval); // If policy with approval couldn't be saved remove the approval object
        res.status(500).send("Server error");
        return;
      }

      if (policy.copyOf) {
        // also check if ?remove-old-ack=true is present
        let data = await fetch(
          `/api/v1/approval/by-policy-id/${policy.copyOf.id}`,
          {
            method: "DELETE",
          }
        );
        if (data.status !== 200) {
          res.status(500).send("server error");
          return;
        }

        const policyAcks: PolicyAck[] = await policyAckRepo.find({
          where: { policy: policy },
          relations: ["employee"],
        });

        policyAcks.map(async (e) => {
          data = await fetch("/api/v1/policy-ack", {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              employeeId: e.employee.id,
              policyId,
              newJoinee: e.newJoinee,
            }),
          });
        });
      }

      res.send(approval);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);

approvalRouter.delete(
  "/by-policy-id/:policyId",
  async (req: Request, res: Response) => {
    try {
      const policyId = parseInt(req.params.policyId);

      const policy: Policy | null = await policyRepo.findOne({
        where: { id: policyId },
        relations: ["isApproved"],
      });
      if (!policy) {
        res.status(400).send("Policy not found");
        return;
      }

      const approval = policy.isApproved;
      if (approval) await approvalRepo.remove(approval);

      res.send("OK");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }
  }
);

approvalRouter.delete(
  "/by-approval-id/:approvalId",
  async (req: Request, res: Response) => {
    try {
      const approvalId = parseInt(req.params.approvalId);

      const approval: Approval | null = await approvalRepo.findOneBy({
        id: approvalId,
      });
      console.log(approval, "approval");
      if (!approval) {
        res.status(500).send("Approval not found");
        return;
      }

      await approvalRepo.remove(approval);
      res.send("OK");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }
  }
);

export default approvalRouter;
