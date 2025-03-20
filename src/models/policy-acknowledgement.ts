import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Employee from "./employee";
import Policy from "./policy";

@Entity()
export class PolicyAck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Employee, (employee) => employee.id)
  employee: Employee;

  @ManyToOne((type) => Policy, (policy) => policy.id)
  policy: Policy;

  @Column({ default: false })
  acked: boolean;

  @Column()
  newJoinee: boolean;

  @Column()
  expiresOn: Date;

  @Column({ nullable: true })
  ackedOn: Date;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  public updated_at: Date;
}

export default PolicyAck;
