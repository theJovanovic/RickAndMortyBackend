import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { User, UserRole } from 'src/db_models/User';
import { Roles } from 'src/auth/roles.decorator';
import { UserDataDTO } from 'src/dto/userdata.dto';

@Controller('user')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @Get('/admin')
    async adminOnlyEndpoint() {
        const users = await this.usersService.getUsers()
        return users
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @Put('/admin')
    async modifyUser(@Body() modifiedUser: UserDataDTO) {
        const users = await this.usersService.modifyUser(modifiedUser)
        return users
    }

    @Post('/register')
    async register(@Body() createUserDTO: CreateUserDTO) {
        return this.usersService.createUser(createUserDTO)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserById(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/logout/:id')
    async logout(@Param('id', ParseIntPipe) id: number) {
        this.usersService.logout(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/updateRole/:id')
    async updateRole(@Param('id', ParseIntPipe) id: number) {
        return await this.usersService.updateRole(id)
    }

}
