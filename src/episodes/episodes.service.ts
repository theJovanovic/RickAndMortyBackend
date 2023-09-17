import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import axios, { AxiosResponse } from 'axios';
import { Episode } from 'src/db_models/Episode';
import { Repository } from "typeorm"

@Injectable()
export class EpisodesService {

    constructor(
        @InjectRepository(Episode)
        private readonly episodes: Repository<Episode>,
    ) { }

    public async getAll(page: number = 1): Promise<any> {
        page = Number(page);

        const [results, count] = await this.episodes.findAndCount({
            skip: (page - 1) * 20,
            take: 20,
            order: {
                id: 'ASC' // Change 'episodeNumber' to the actual column name you want to sort by
            }
        });

        const totalPages = Math.ceil(count / 20);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const next = hasNextPage ? `http://localhost:3000/episode?page=${page + 1}` : null;
        const prev = hasPrevPage ? `http://localhost:3000/episode?page=${page - 1}` : null;

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

    public async getById(id: number): Promise<Episode> {
        const episode = await this.episodes.findOne({ where: { id: id } });
        if (!episode) {
            throw new NotFoundException(`Episode with id ${id} not found`);
        }
        return episode;
    }

    public async fetchAndSaveCharacters() {
        for (let index = 1; index <= 3; index++) {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${index}`);
            const apiCharacters = response.data.results;
            await this.episodes.save(apiCharacters);
        }
    }

    public async getByIds(ids: number[]): Promise<Episode[]> {
        return await this.episodes.findByIds(ids);
    }

}
