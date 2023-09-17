import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import axios, { AxiosResponse } from 'axios';

@Controller('character')
export class CharactersController {

    constructor(
        private readonly charactersService: CharactersService,
    ) { }

    @Get('/fetchAndSave')
    async fetchAndSaveCharacters() {
        await this.charactersService.fetchAndSaveCharacters();
        return 'Data fetched and saved successfully';
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
