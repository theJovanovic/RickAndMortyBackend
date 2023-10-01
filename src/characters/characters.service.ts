import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository, getRepository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Character } from 'src/db_models/Character';
import { Location } from 'src/db_models/Location';
import { Episode } from 'src/db_models/Episode';
import { CharacterFilter } from 'src/dto/filter-character.dto';

@Injectable()
export class CharactersService {

    constructor(
        @InjectRepository(Character)
        private readonly characters: Repository<Character>,
    ) { }

    public async getAll(page: number = 1, filters: CharacterFilter, limit: number = 15) {
        page = Number(page);

        const whereConditions: any = {};
        let filterQuery = ""

        if (filters.name) {
            whereConditions['name'] = Like(`%${filters.name}%`);
            filterQuery = filterQuery.concat(`&name=${filters.name}`)
        }

        if (filters.status) {
            whereConditions['status'] = filters.status;
            filterQuery = filterQuery.concat(`&status=${filters.status}`)
        }

        if (filters.species) {
            whereConditions['species'] = filters.species;
            filterQuery = filterQuery.concat(`&species=${filters.species}`)
        }

        if (filters.gender) {
            whereConditions['gender'] = filters.gender;
            filterQuery = filterQuery.concat(`&gender=${filters.gender}`)
        }


        const [results, count] = await this.characters.findAndCount({
            where: whereConditions,
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'ASC'
            }
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const next = hasNextPage ? `http://localhost:3000/characters?page=${page + 1}${filterQuery}` : null;
        const prev = hasPrevPage ? `http://localhost:3000/characters?page=${page - 1}${filterQuery}` : null;

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
        const character = await this.characters.findOne({ where: { id: id } });
        if (!character) {
            throw new NotFoundException(`Character with id ${id} not found`);
        }
        return character;
    }

    public async getByIds(ids: number[]) {
        return await this.characters.findByIds(ids);
    }

    public async addCharacter(character: Character) {
        const allCharacters = await this.characters.find();
        const sortedCharacters = allCharacters.sort((a, b) => {
            const idA = parseInt(a.url.split('/').pop() || '0', 10);
            const idB = parseInt(b.url.split('/').pop() || '0', 10);
            return idB - idA;
        });
        const lastCharacter = sortedCharacters[0];
        const lastId = lastCharacter ? parseInt(lastCharacter.url.split('/').pop() || '0', 10) : 0;

        character.url = `${character.url}${lastId + 1}`
        const newCharacter = this.characters.create(character)
        return await this.characters.save(newCharacter)
    }

    public async deleteCharacter(id: number) {
        const character = await this.characters.findOne({ where: { id: id } });
        if (!character) {
            throw new NotFoundException(`Character with id ${id} not found`);
        }

        await this.characters.delete(id)

        return this.getAll(1, {})
    }

    public async getTopLocationsByCharacterCount() {
        return await this.characters
            .createQueryBuilder("character")
            .select("character.location ->> 'name' as location_name, COUNT(*) as character_count")
            .groupBy("character.location ->> 'name'")
            .orderBy("character_count", "DESC")
            .limit(10)
            .getRawMany();
    }

    public async getEpisodeCharacters(characterURLs: string[]) {
        return await this.characters.find({
            where: characterURLs.map(url => ({ url: url })),
        });
    }

    // public async fetchAndSaveCharacters() {
    //     for (let index = 1; index <= 42; index++) {
    //         const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${index}`);
    //         const apiCharacters = response.data.results;
    //         await this.characters.save(apiCharacters);
    //     }
    // }

    // public async updateEpisodeUrls(): Promise<void> {
    //     const characters = await this.characters.find();

    //     const updatedCharacters = characters.map(character => {
    //         // character.episode = character.episode.map(url => url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000'));
    //         // character.url = character.url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000');
    //         character.origin.url = character.origin.url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000');
    //         character.location.url = character.location.url.replace('https://rickandmortyapi.com/api', 'http://localhost:3000');
    //         return character;
    //     });

    //     await this.characters.save(updatedCharacters);
    // }
}
