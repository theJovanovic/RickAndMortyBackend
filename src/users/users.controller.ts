import { Controller, Post, Body, Get } from '@nestjs/common';
import { User } from 'src/db_models/User';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/models/create-user.dto';

@Controller('user')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post('/register')
    async register(@Body() createUserDTO: CreateUserDTO) {
        return this.usersService.createUser(createUserDTO)
    }

    @Get()
    async getUsers() {
        return this.usersService.getUsers()
    }
}
