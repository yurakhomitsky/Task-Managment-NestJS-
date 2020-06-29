import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
export class TaskDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus;
}