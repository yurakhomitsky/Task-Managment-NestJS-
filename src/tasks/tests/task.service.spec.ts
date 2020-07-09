import { Test } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { TasksRepository } from '../tasks.repository';
import { GetTaskFilterDto } from '../dto/get-tasks-filter-dto';
import { TaskStatus } from '../task-status.enum';
import { User } from '../../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';



const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    save: jest.fn().mockResolvedValue(true)
});




describe('TaskService', () => {
    let tasksService: TasksService;
    let taskRepositoty;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository, useFactory: mockTaskRepository
                }
            ]
        }).compile();

        tasksService = await module.get(TasksService);
        taskRepositoty = await module.get(TasksRepository);
        user = new User()
        user.username = 'Yura';
        user.id = 1;
    });


    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {

            taskRepositoty.getTasks.mockResolvedValue('someValue')
            expect(taskRepositoty.getTasks).not.toHaveBeenCalled();

            const filters: GetTaskFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'Yura'
            };

            const result = await tasksService.getTasks(filters, user);

            expect(taskRepositoty.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        })
    })
    describe('getTaskById', () => {
        it('should find task', async () => {
            const mockTask = { title: 'Test task', desription: 'Test desc' }


            taskRepositoty.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, user);

            expect(result).toMatchObject(mockTask);
            expect(taskRepositoty.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: user.id
                }
            })
        })

        it('should throws an error as task is not found', async () => {
            taskRepositoty.findOne.mockResolvedValue(null);

            expect(tasksService.getTaskById(1, user)).rejects.toThrow(NotFoundException);
        })


    })

    describe('createTask', () => {
        it('should create task', async () => {
            const mockCreateTaskDto: CreateTaskDto = {
                title: 'Wash car',
                description: 'some description'
            };


            taskRepositoty.createTask.mockResolvedValue(mockCreateTaskDto);
            const task = await tasksService.createTask(mockCreateTaskDto, user);


            expect(taskRepositoty.createTask).toHaveBeenCalledWith(mockCreateTaskDto, user)
            expect(task).toMatchObject(mockCreateTaskDto);
        })
    })

    describe('deleteTask', () => {
        it('should delete task', async () => {

            taskRepositoty.delete.mockResolvedValue({ affected: 1 });

            expect(taskRepositoty.delete).not.toHaveBeenCalled()
            await tasksService.deleteTask(1, user);
            expect(taskRepositoty.delete).toHaveBeenCalledWith({ id: 1, userId: user.id })

        })

        it('should throw an error as task could not found', async () => {
            expect(taskRepositoty.delete).not.toHaveBeenCalled()
            taskRepositoty.delete.mockResolvedValue({ affected: 0 });

            await expect(tasksService.deleteTask(1, user)).rejects.toThrow(NotFoundException);

            expect(taskRepositoty.delete).toHaveBeenCalledWith({ id: 1, userId: user.id })
        })
    })

    describe('update Task status', () => {
        it('should update task status',async () => {
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
            })

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, user);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(taskRepositoty.save).toHaveBeenCalled();
            expect(result.status).toBe(TaskStatus.DONE);
        })
    })
})