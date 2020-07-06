import { Controller, Post, Body, ValidationPipe, UseInterceptors, } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { TransformInterceptor } from '../interceptor/transform.interceptor';


@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {

    constructor(private authService: AuthService){}
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
       return this.authService.signUp(authCredentialsDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
       return this.authService.signIn(authCredentialsDto);
    }
    
}