import { Repository, EntityRepository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await this.save(task);
        return task;
    }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` })
        }

        const tasks = await query.getMany();
        return tasks;
    }
}