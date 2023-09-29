import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserDTO } from 'src/dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('/login')
    async signIn(@Body() loginUserDTO: LoginUserDTO) {
        return this.authService.login(loginUserDTO);
    }
}