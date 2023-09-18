import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersController } from './characters/characters.controller';
import { CharactersService } from './characters/characters.service';
import { EpisodesController } from './episodes/episodes.controller';
import { EpisodesService } from './episodes/episodes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'typeorm.config';
import { Character } from './db_models/Character';
import { Episode } from './db_models/Episode';
import { Location } from './db_models/Location';
import { User } from './db_models/User';
import { LocationsController } from './locations/locations.controller';
import { LocationsService } from './locations/locations.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([
      User,
      Character,
      Episode,
      Location
    ]),
    UsersModule,
    AuthModule
  ],
  controllers: [
    AppController,
    CharactersController,
    EpisodesController,
    LocationsController,
  ],
  providers: [
    AppService,
    CharactersService,
    EpisodesService,
    LocationsService,
  ],
})
export class AppModule { }
