import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Suggestion } from "src/db_models/Suggestion";
import { SuggestionsController } from "./suggestions.controller";
import { SuggestionsService } from "./suggestions.service";
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([Suggestion]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [SuggestionsController],
    providers: [SuggestionsService],
    exports: [SuggestionsService]
})
export class SuggestionsModule { }
