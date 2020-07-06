import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();

        const errorResponse = {

            statusCode: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: exception.message,
        }

        response
            .status(status)
            .json(errorResponse);
    }
}