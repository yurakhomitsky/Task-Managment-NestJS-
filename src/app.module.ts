import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
// import { APP_FILTER } from '@nestjs/core';
// import { HttpExceptionFilter } from './shared/http-error.filter';

@Module({
    imports: [TasksModule, TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}

// {
//     provide: APP_FILTER,
//     useClass: HttpExceptionFilter,
// }