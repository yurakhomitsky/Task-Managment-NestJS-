import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, Put, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskDto } from './dto/task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskService.getTasks(filterDto);

    }

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    updateTask(@Param('id', ParseIntPipe) id: number, @Body() taskDto: TaskDto): Promise<Task> {
        return this.taskService.updateTask(id, taskDto);
    }

    @Patch(':id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id',ParseIntPipe) id: number): Promise<void> {
       return this.taskService.deleteTask(id);
    }
}
