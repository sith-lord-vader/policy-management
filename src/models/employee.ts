import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import sprintDataSource from "../db"

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullname: string

    @Column()
    email: string

    @Column()
    phoneno: string

    @Column("text")
    address: string

    @Column("date", {nullable: true})
    joinedOn: Date

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}

export default Employee