import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Approval from "./approval";
import Employee from "./employee";

@Entity()
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Approval, (approval) => approval.id, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "is_approved_id" })
  isApproved: Approval;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column({ nullable: true })
  templateId: number;

  @ManyToOne((type) => Employee, (employee) => employee.id)
  createdBy: Employee;

  @ManyToOne((type) => Policy, (policy) => policy.id, { nullable: true })
  copyOf: Policy;

  @Column()
  duration: number;

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

export default Policy;
