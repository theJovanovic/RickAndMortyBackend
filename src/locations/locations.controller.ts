import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import axios, { AxiosResponse } from 'axios';
import { Location } from 'src/db_models/Location';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EpisodesService } from 'src/episodes/episodes.service';
import { CharactersService } from 'src/characters/characters.service';

@Controller('location')
export class LocationsController {

    constructor(
        private readonly locationsService: LocationsService
    ) { }

    // @Get('/fetchAndSave')
    // async fetchAndSaveCharacters() {
    //     await this.locationsService.fetchAndSaveCharacters();
    //     return 'Data fetched and saved successfully';
    // }

    // @Get('/updateUrls')
    // async updateUrls() {
    //     await this.locationsService.updateEpisodeUrls();
    //     return 'Data updated successfully';
    // }

    // @UseGuards(JwtAuthGuard)
    @Get('/charts')
    async getCharts() {
        const charactersChart = await this.locationsService.getCharactersChart()
        const episodesChart = await this.locationsService.getEpisodesChart()
        const pieChart = await this.locationsService.getPieChart()
        return { charactersChart: charactersChart, episodesChart: episodesChart, pieChart: pieChart }
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/:id/chart')
    async getLocationPiechart(@Param('id', ParseIntPipe) id: number) {
        const locationPieChart = await this.locationsService.getLocationPieChart(id)
        return { locationPieChart: locationPieChart }
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Location[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.locationsService.getByIds(idArray);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getLocationById(@Param('id', ParseIntPipe) id: number) {
        return await this.locationsService.getById(id);
    }

    // @UseGuards(JwtAuthGuard)
    @Get()
    async getAllLocations(@Query('page') page: number) {
        return await this.locationsService.getAll(page);
    }

}
