import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { User } from 'src/db_models/User';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/models/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

    @UseGuards(JwtAuthGuard)
    @Post('/logout/:id')
    async logout(@Param('id', ParseIntPipe) id: number) {
        this.usersService.logout(id)
    }
}
