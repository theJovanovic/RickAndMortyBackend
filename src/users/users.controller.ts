import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
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

    @Get('/:id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserById(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/logout/:id')
    async logout(@Param('id', ParseIntPipe) id: number) {
        this.usersService.logout(id)
    }

    @Get()
    async getUsers() {
        return this.usersService.getUsers()
    }

}
