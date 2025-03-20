import express, { Request, Response, Router } from "express";
import { Repository } from "typeorm";
import sprintDataSource from "../../db";
import Employee from "../../models/employee";

interface employeeData {
  fullname: string;
  email: string;
  phoneno: string;
  address: string;
}

const employeeRepo: Repository<Employee> =
  sprintDataSource.getRepository(Employee);
const employeeRouter: Router = express.Router();

employeeRouter.get("/:employeeId", async (req: Request, res: Response) => {
  try {
    let employeeId: undefined | number = undefined;
    try {
      employeeId = parseInt(req.params.employeeId);
    } catch (error) {
      res.status(400).send("Employee Id must be a number");
    }
    const ourEmployee = await employeeRepo.findOneBy({ id: employeeId });
    console.log(ourEmployee);
    if (ourEmployee) {
      res.send(ourEmployee);
      return;
    }
    res.status(404).send("Employee not on the database");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

employeeRouter.post("/", async (req: Request, res: Response) => {
  const data: employeeData = { ...req.body };
  try {
    const existingUsers: Employee[] = await employeeRepo.find({
      where: {
        email: data.email,
      },
    });
    console.log(existingUsers);
    if (existingUsers.length === 0) {
      const newEmployee: Employee = new Employee();
      newEmployee.fullname = data.fullname;
      newEmployee.email = data.email;
      newEmployee.phoneno = data.phoneno;
      newEmployee.address = data.address;
      await employeeRepo.save(newEmployee);
      res.json(newEmployee);
      return;
    }
    res.send("OK");
  } catch (error) {
    console.error(error);
    res.status(503).send("Not Ok");
  }
});

export default employeeRouter;
