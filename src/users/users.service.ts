import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
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
        if (createUserDTO.firstname === "") {
            throw new BadRequestException(`First name empty`);
        }
        if (createUserDTO.lastname === "") {
            throw new BadRequestException(`Last name empty`);
        }
        if (createUserDTO.password === "") {
            throw new BadRequestException(`Password empty`);
        }
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

        throw new BadRequestException(`User with that email already exists`);
    }

    async getUsers() {
        const sortedUsers = await this.getSortedUsersByRole()
        const sanitizedUsers = this.sanitizeUsers(sortedUsers)
        return sanitizedUsers as UserDataDTO[]
    }

    async modifyUser(modifiedUser: UserDataDTO) {
        const user = await this.users.findOne({ where: { id: modifiedUser.id } });
        if (!user) {
            throw new NotFoundException(`Location with id ${modifiedUser.id} not found`);
        }
        await this.users.update(modifiedUser.id, modifiedUser as User)
        const sortedUsers = await this.getSortedUsersByRole()
        const sanitizedUsers = this.sanitizeUsers(sortedUsers)
        return sanitizedUsers as UserDataDTO[]
    }

    async deleteUser(id: number) {
        await this.users.delete(id)
        return await this.getUsers()
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

    private sanitizeUsers(users: User[]) {
        return users.map(user => {
            const { password, ...rest } = user
            return rest
        })
    }
    private async getSortedUsersByRole() {
        const users = await this.users.find()
        const sortedUsers = users.sort((a, b) => {
            if (a.role < b.role) return -1;
            if (a.role > b.role) return 1;
            return 0;
        });
        return sortedUsers
    }

}
