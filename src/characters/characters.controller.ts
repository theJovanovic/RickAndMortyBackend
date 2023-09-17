import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import axios, { AxiosResponse } from 'axios';
import { Character } from 'src/db_models/Character';

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

    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Character[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.charactersService.getByIds(idArray);
    }

    @Get('/:id')
    async getCharacterById(@Param('id', ParseIntPipe) id: number) {
        return await this.charactersService.getById(id);
    }

    @Get()
    async getAllCharacters(@Query('page') page: number) {
        return await this.charactersService.getAll(page);
    }
}
