import { Controller, Get, Param, ParseIntPipe, Query, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { CharactersService } from './characters.service';
import axios, { AxiosResponse } from 'axios';
import { Character } from 'src/db_models/Character';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CharacterFilter } from 'src/models/character.filter.dto';
import { log } from 'console';

@Controller('character')
export class CharactersController {

    constructor(
        private readonly charactersService: CharactersService,
    ) { }

    // @Get('/fetchAndSave')
    // async fetchAndSaveCharacters() {
    //     await this.charactersService.fetchAndSaveCharacters();
    //     return 'Data fetched and saved successfully';
    // }

    // @Get('/updateUrls')
    // async updateUrls() {
    //     await this.charactersService.updateEpisodeUrls();
    //     return 'Data updated successfully';
    // }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    public async addCharacter(@Body() character: Character) {
        return this.charactersService.addCharacter(character)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Character[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.charactersService.getByIds(idArray);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getCharacterById(@Param('id', ParseIntPipe) id: number) {
        return await this.charactersService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    public async deleteCharacter(@Param('id', ParseIntPipe) id: number) {
        return this.charactersService.deleteCharacter(id)
    }

    // @UseGuards(JwtAuthGuard)
    // @Get()
    // async getAllCharacters(@Query('page') page: number) {
    //     return await this.charactersService.getAll(page);
    // }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllCharacters(
        @Query('page') page: number,
        @Query('name') name?: string,
        @Query('status') status?: string,
        @Query('species') species?: string,
        @Query('gender') gender?: string) {
        const characterFilter = {
            name,
            status,
            species,
            gender
        } as CharacterFilter
        return await this.charactersService.getAll(page, characterFilter);
    }
}
