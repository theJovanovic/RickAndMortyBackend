import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import axios, { AxiosResponse } from 'axios';

@Controller('location')
export class LocationsController {

    constructor(
        private readonly locationsService: LocationsService,
    ) { }

    @Get('/fetchAndSave')
    async fetchAndSaveCharacters() {
        await this.locationsService.fetchAndSaveCharacters();
        return 'Data fetched and saved successfully';
    }

    @Get(':id')
    async getLocationById(@Param('id') id: number) {
        return await this.locationsService.getById(id);
    }

    @Get()
    async getAllLocations(@Query('page') page: number) {
        return await this.locationsService.getAll(page);
    }

}
