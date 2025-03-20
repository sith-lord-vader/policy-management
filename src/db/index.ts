import { config } from "dotenv";
import { DataSource } from "typeorm";
import Employee from "../models/employee";
import { Policy } from "../models/policy";
import PolicyAck from "../models/policy-acknowledgement";

config();

const sprintDataSource: DataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Policy, Employee, PolicyAck],
  subscribers: [],
  migrations: [],
  ssl: true,
});

export default sprintDataSource;
