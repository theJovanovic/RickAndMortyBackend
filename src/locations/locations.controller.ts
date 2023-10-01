import { Controller, Get, Param, Query, ParseIntPipe, UseGuards, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from 'src/db_models/Location';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/db_models/User';

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

    @UseGuards(JwtAuthGuard)
    @Get('/charts')
    async getCharts() {
        const charactersChart = await this.locationsService.getCharactersChart()
        const episodesChart = await this.locationsService.getEpisodesChart()
        const pieChart = await this.locationsService.getLocationsPieChart()
        return { charactersChart: charactersChart, episodesChart: episodesChart, pieChart: pieChart }
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @Delete('/admin/:id')
    public async deleteLocation(@Param('id', ParseIntPipe) id: number) {
        return this.locationsService.deleteLocation(id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id/charts')
    async getLocationPiechart(@Param('id', ParseIntPipe) id: number) {
        const locationPieChartSpecies = await this.locationsService.getLocationPieChartSpecies(id)
        const locationPieChartEpisodes = await this.locationsService.getLocationPieChartEpisodes(id)
        return { locationPieChartSpecies: locationPieChartSpecies, locationPieChartEpisodes: locationPieChartEpisodes }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Location[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.locationsService.getByIds(idArray);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getLocationById(@Param('id', ParseIntPipe) id: number) {
        return await this.locationsService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllLocations(@Query('page') page: number) {
        return await this.locationsService.getAll(page);
    }

}
