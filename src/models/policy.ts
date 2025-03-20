import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import sprintDataSource from "../db"
import Employee from "./employee"

@Entity()
export class Policy {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // isApproved: number

    @Column()
    title: string

    @Column("text")
    content: string

    @Column({nullable: true})
    templateId: number

    @ManyToOne((type) => Employee, (employee) => employee.id)
    @JoinColumn({name: "createdById"})
    createdBy: Employee

    @Column()
    duration: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}

export default Policy