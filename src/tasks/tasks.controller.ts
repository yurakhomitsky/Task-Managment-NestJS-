import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UsePipes,
    ValidationPipe,
    Put,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskDto } from './dto/task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from '../interceptor/transform.interceptor';
import { User } from '../auth/user.entity';
import { ReqUser } from '../auth/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseInterceptors(TransformInterceptor)
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @ReqUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username} retrieviening all tasks. Filters: ${JSON.stringify(filterDto)}"`)
        return this.taskService.getTasks(filterDto, user);
    }

    @Get(':id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @ReqUser() user: User,
    ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @ReqUser() user: User,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body() taskDto: TaskDto,
        @ReqUser() user: User,
    ): Promise<Task> {
        return this.taskService.updateTask(id, taskDto, user);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe)
        status: TaskStatus,
        @ReqUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username} patching status. Status: ${JSON.stringify(status)}, ID: ${JSON.stringify(id)}"`)
        return this.taskService.updateTaskStatus(id, status, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @ReqUser() user: User,
        ): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }
}
