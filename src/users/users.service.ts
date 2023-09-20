import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/models/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Location } from 'src/db_models/Location';
import { Repository } from 'typeorm';
import { User } from 'src/db_models/User';
import { create } from 'domain';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';

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
        return this.users.find()
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
    

}
