import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/db_models/User';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { UserDataDTO } from 'src/dto/userdata.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async updateUser(updatedUser: User) {
        await this.users.update(updatedUser.id, updatedUser)
    }

    async createUser(createUserDTO: CreateUserDTO) {
        const existingUser = await this.users.findOne({ where: { email: createUserDTO.email } });
        if (!existingUser) {
            createUserDTO.password = await bcrypt.hash(
                createUserDTO.password,
                10
            )
            const user = this.users.create(createUserDTO)

            await this.users.save(user)

            const payload = { sub: user.id, email: user.email };
            const accessToken = await this.jwtService.signAsync(payload);

            user.isActive = true
            this.updateUser(user)

            return { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, token: accessToken }
        }

        return { id: null, firstname: null, lastname: null, email: null, token: null }

    }

    async getUsers() {
        const users = await this.users.find()
        users.map(user => {
            delete user.password
            return user
        })
        return users as UserDataDTO[]
    }

    async modifyUser(modifiedUser: UserDataDTO) {
        const user = await this.users.findOne({ where: { id: modifiedUser.id } });
        if (!user) {
            throw new NotFoundException(`Location with id ${modifiedUser.id} not found`);
        }
        const dbModifiedUser = await this.users.update(modifiedUser.id, modifiedUser as User)
        const users = await this.users.find()
        users.map(user => {
            delete user.password
            return user
        })
        return users as UserDataDTO[]
    }

    async findOne(id: number): Promise<User> {
        return this.users.findOne({ where: { id: id } });
    }

    async findByEmail(email: string): Promise<User> {
        return this.users.findOne({ where: { email } });
    }

    async logout(id: number) {
        const user = await this.users.findOne({ where: { id: id } });
        user.isActive = false
        await this.updateUser(user)
    }

    async getUserById(id: number) {
        const user = await this.users.findOne({ where: { id: id } });
        if (!user) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }
        return user
    }

    async userCount() {
        const users = await this.users.find();
        return users.length
    }


    async updateRole(userId: number): Promise<User> {
        const user = await this.users.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        user.role = UserRole.ADMIN;
        await this.users.save(user);

        return user;
    }

}
