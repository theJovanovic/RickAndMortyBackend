import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import axios, { AxiosResponse } from 'axios';
import { Location } from 'src/db_models/Location';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {

    constructor(
        @InjectRepository(Location)
        private readonly locations: Repository<Location>,
    ) { }

    public async getAll(page: number = 1, limit: number = 20) {
        page = Number(page);

        const [results, count] = await this.locations.findAndCount({
            skip: (page - 1) * limit,
            take: limit
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const next = hasNextPage ? `http://localhost:3000/location?page=${page + 1}` : null;
        const prev = hasPrevPage ? `http://localhost:3000/location?page=${page - 1}` : null;

        return {
            info: {
                count,
                pages: totalPages,
                next,
                prev
            },
            results
        };
    }

    public async getById(id: number) {
        const location = await this.locations.findOne({ where: { id: id } });
        if (!location) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }
        return location;
    }

    public async fetchAndSaveCharacters() {
        for (let index = 1; index <= 7; index++) {
            const response = await axios.get(`https://rickandmortyapi.com/api/location?page=${index}`);
            const apiCharacters = response.data.results;
            await this.locations.save(apiCharacters);
        }
    }

    public async getByIds(ids: number[]) {
        return await this.locations.findByIds(ids);
    }

    // public async updateEpisodeUrls(): Promise<void> {
    //     const locations = await this.locations.find();

    //     const updatedCharacters = locations.map(episode => {
    //         // episode.residents = episode.residents.map(url => url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000'));
    //         episode.url = episode.url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000');
    //         return episode;
    //     });

    //     await this.locations.save(updatedCharacters);
    // }
}
