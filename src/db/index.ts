import {DataSource} from 'typeorm'
import { Policy } from '../models/policy';
import { config } from 'dotenv';
import Employee from '../models/employee';

config()

const sprintDataSource: DataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Policy, Employee],
    subscribers: [],
    migrations: [],
    ssl: true
})

export default sprintDataSource;