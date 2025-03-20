import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import sprintDataSource from "../db"
import Employee from "./employee"
import Policy from "./policy"

@Entity()
export class PolicyAck {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne((type) => Employee, (employee) => employee.id)
    employeeId: Employee

    @ManyToOne((type) => Policy, (policy) => policy.id)
    policyId: Policy

    @Column({default: false})
    acked: boolean

    @Column()
    newJoinee: boolean

    @Column()
    expiresOn: Date

    @Column({nullable: true})
    ackedOn: Date

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}

export default Policy