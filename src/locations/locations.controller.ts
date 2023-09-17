import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import axios, { AxiosResponse } from 'axios';
import { Location } from 'src/db_models/Location';

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

    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Location[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.locationsService.getByIds(idArray);
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
