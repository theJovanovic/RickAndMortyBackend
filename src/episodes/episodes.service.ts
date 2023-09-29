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

    public async getAll(page: number = 1, limit: number = 20) {
        page = Number(page);

        const [results, count] = await this.episodes.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'ASC'
            }
        });

        const totalPages = Math.ceil(count / limit);
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

    public async getById(id: number) {
        const episode = await this.episodes.findOne({ where: { id: id } });
        if (!episode) {
            throw new NotFoundException(`Episode with id ${id} not found`);
        }
        return episode;
    }

    public async getByIds(ids: number[]) {
        return await this.episodes.findByIds(ids);
    }

    async incrementLikes(id: number, user_id: number): Promise<Episode> {
        const episode = await this.episodes.findOne({ where: { id: id } });
        if (!episode) {
            throw new Error('Episode not found');
        }
        if (episode.like_users_id.includes(user_id)) {
            episode.likes--
            episode.like_users_id = episode.like_users_id.filter(id => id !== user_id)
            return this.episodes.save(episode);
        }
        if (episode.dislike_users_id?.includes(user_id)) {
            episode.dislikes--
            episode.dislike_users_id = episode.dislike_users_id.filter(id => id !== user_id)
        }
        episode.likes++;
        episode.like_users_id.push(user_id)
        return this.episodes.save(episode);
    }

    async incrementDislikes(id: number, user_id: number): Promise<Episode> {
        const episode = await this.episodes.findOne({ where: { id: id } });
        if (!episode) {
            throw new Error('Episode not found');
        }
        if (episode.dislike_users_id.includes(user_id)) {
            episode.dislikes--
            episode.dislike_users_id = episode.dislike_users_id.filter(id => id !== user_id)
            return this.episodes.save(episode);
        }
        if (episode.like_users_id?.includes(user_id)) {
            episode.likes--
            episode.like_users_id = episode.like_users_id.filter(id => id !== user_id)
        }
        episode.dislikes++;
        episode.dislike_users_id.push(user_id)
        return this.episodes.save(episode);
    }

    // public async fetchAndSaveCharacters() {
    //     for (let index = 1; index <= 3; index++) {
    //         const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${index}`);
    //         const apiCharacters = response.data.results;
    //         await this.episodes.save(apiCharacters);
    //     }
    // }

    // public async updateEpisodeUrls(): Promise<void> {
    //     const episodes = await this.episodes.find();

    //     const updatedCharacters = episodes.map(episode => {
    //         // episode.characters = episode.characters.map(url => url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000'));
    //         episode.url = episode.url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000');
    //         return episode;
    //     });

    //     await this.episodes.save(updatedCharacters);
    // }

}
