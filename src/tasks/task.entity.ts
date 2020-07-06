import { Entity, PrimaryGeneratedColumn, Column,ManyToOne } from "typeorm";
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Exclude } from "class-transformer/decorators";

@Entity()
export class Task {

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    
    @ManyToOne(type => User, user => user, { eager: false })
    @Exclude()
    user: User;

    @Column()
    userId: number;

    constructor(partial: Partial<Task>) {
        Object.assign(this, partial);
      }
}