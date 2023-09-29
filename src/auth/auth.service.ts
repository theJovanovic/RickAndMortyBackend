import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDTO } from 'src/dto/login-user.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(signInDto: LoginUserDTO) {
        const { email, password } = signInDto;

        const user = await this.usersService.findByEmail(email);

        if (!user) {
            // throw new UnauthorizedException('Invalid username or password');
            return { id: null, firstname: null, lastname: null, email: null, token: null }
        }
        const passwordIsValid = await user.validatePassword(password);

        if (!passwordIsValid) {
            // throw new UnauthorizedException('Invalid username or password');
            return { id: null, firstname: null, lastname: null, email: null, token: null }
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);

        user.isActive = true
        this.usersService.updateUser(user)

        return { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, token: accessToken }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await user.validatePassword(password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}