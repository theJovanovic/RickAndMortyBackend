import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { ApiResponse } from 'src/models/ApiResponse';
import { Episode } from 'src/db_models/Episode';
import axios, { AxiosResponse } from 'axios';

@Controller('episode')
export class EpisodesController {

    constructor(
        private readonly episodesService: EpisodesService,
    ) { }

    @Get('/fetchAndSave')
    async fetchAndSaveCharacters() {
        await this.episodesService.fetchAndSaveCharacters();
        return 'Data fetched and saved successfully';
    }

    @Get(':id')
    async getEpisodeById(@Param('id') id: number) {
        return await this.episodesService.getById(id);
    }

    @Get()
    async getAllEpisodes(@Query('page') page: number) {
        return await this.episodesService.getAll(page);
    }

    
}
