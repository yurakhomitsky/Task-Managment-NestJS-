import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskDto } from './dto/task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository) { }


    getTasks(filterDto: GetTaskFilterDto) {
        return this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.tasksRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.tasksRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTask(id: number, taskDto: TaskDto): Promise<Task> {
        const task = await this.getTaskById(id);
        const updated = {
            ...task,
            ...taskDto
        }
        await this.tasksRepository.save(updated);
        return updated;

    }
    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

}
