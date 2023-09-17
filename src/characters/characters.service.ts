import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, getRepository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Character } from 'src/db_models/Character';
import { ApiResponse } from 'src/models/ApiResponse';
import axios, { AxiosResponse } from 'axios';
import { Episode } from 'src/db_models/Episode';

@Injectable()
export class CharactersService {

    constructor(
        @InjectRepository(Character)
        private readonly characters: Repository<Character>,
    ) { }

    public async getAll(page: number = 1, limit: number = 20): Promise<any> {
        page = Number(page);

        const [results, count] = await this.characters.findAndCount({
            skip: (page - 1) * limit,
            take: limit
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const next = hasNextPage ? `http://localhost:3000/characters?page=${page + 1}` : null;
        const prev = hasPrevPage ? `http://localhost:3000/characters?page=${page - 1}` : null;

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


    public async getById(id: number): Promise<Character> {
        const character = await this.characters.findOne({ where: { id: id } });
        if (!character) {
            throw new NotFoundException(`Character with id ${id} not found`);
        }
        return character;
    }

    public async fetchAndSaveCharacters() {
        for (let index = 1; index <= 42; index++) {
            const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${index}`);
            const apiCharacters = response.data.results;
            await this.characters.save(apiCharacters);
        }
    }

    public async getByIds(ids: number[]): Promise<Character[]> {
        return await this.characters.findByIds(ids);
    }
}
