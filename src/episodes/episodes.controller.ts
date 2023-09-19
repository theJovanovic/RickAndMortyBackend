import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { ApiResponse } from 'src/models/api_response';
import { Episode } from 'src/db_models/Episode';
import axios, { AxiosResponse } from 'axios';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('episode')
export class EpisodesController {

    constructor(
        private readonly episodesService: EpisodesService,
    ) { }

    // @Get('/fetchAndSave')
    // async fetchAndSaveCharacters() {
    //     await this.episodesService.fetchAndSaveCharacters();
    //     return 'Data fetched and saved successfully';
    // }

    // @Get('/updateUrls')
    // async updateUrls() {
    //     await this.episodesService.updateEpisodeUrls();
    //     return 'Data updated successfully';
    // }

    @UseGuards(JwtAuthGuard)
    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Episode[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.episodesService.getByIds(idArray);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getEpisodeById(@Param('id', ParseIntPipe) id: number) {
        return await this.episodesService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllEpisodes(@Query('page') page: number) {
        return await this.episodesService.getAll(page);
    }

    
}
