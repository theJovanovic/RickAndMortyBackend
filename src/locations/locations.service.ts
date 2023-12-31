import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios';
import { CharactersService } from 'src/characters/characters.service';
import { Location } from 'src/db_models/Location';
import { BarChart, Series } from 'src/dto/bar-chart.dto';
import { Data, PieChart, Series as PieSeries } from 'src/dto/pie-chart.dto';
import { EpisodesService } from 'src/episodes/episodes.service';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {

    constructor(
        @InjectRepository(Location)
        private readonly locations: Repository<Location>,
        private readonly characterService: CharactersService,
        private readonly episodeService: EpisodesService
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

    public async getCharactersChart() {
        const queryResult = await this.characterService.getTopLocationsByCharacterCount();

        const categories = queryResult.map(record => record.location_name);
        const data = queryResult.map(record => +record.character_count);

        const series: Series[] = [{
            name: 'Number of Characters',
            data: data
        }];

        const chart: BarChart = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Top 10 Locations by Number of Characters'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Number of Characters'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    groupPadding: 0.1
                }
            },
            series: series
        };

        return chart;
    }
    public async getEpisodesChart() {
        const allEpisodes = await this.episodeService.getAllEpisodes()

        const locationEpisodeCount = new Map<string, number>();

        for (const episode of allEpisodes) {
            const characterURLs = episode.characters;

            const episodeCharacters = await this.characterService.getEpisodeCharacters(characterURLs)

            const episodeLocations = new Set(
                episodeCharacters.map(character => character.location.name)
            );

            for (const location of episodeLocations) {
                locationEpisodeCount.set(
                    location,
                    (locationEpisodeCount.get(location) || 0) + 1
                );
            }
        }

        const sortedLocations = Array.from(locationEpisodeCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const categories = sortedLocations.map(([location]) => location);
        const data = sortedLocations.map(([, count]) => count);

        const series: Series[] = [{
            name: 'Number of Episodes',
            data: data
        }];

        const chart: BarChart = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Top 10 Locations by Number of Episodes'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Number of Episodes'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    groupPadding: 0.1
                }
            },
            series: series
        };

        return chart;
    }
    public async getLocationsPieChart() {
        const allLocations = await this.locations.find();

        const locationTypeCount = new Map<string, number>();

        for (const location of allLocations) {
            const type = location.type;
            locationTypeCount.set(
                type,
                (locationTypeCount.get(type) || 0) + 1
            );
        }

        const seriesData: Data[] = Array.from(locationTypeCount).map(([name, count]) => ({
            name,
            y: count
        }));

        const series: PieSeries[] = [{
            name: 'Location Types',
            data: seriesData
        }];

        const pieChart: PieChart = {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Location Type Distribution'
            },
            series: series
        };

        return pieChart;
    }

    public async getLocationPieChartSpecies(id: number) {
        const location = await this.locations.findOne({ where: { id: id } });

        if (!location) {
            throw new Error('Location not found');
        }

        const residentUrls = location.residents;
        const speciesCount = {};

        for (const url of residentUrls) {
            const urlParts = url.split('/');
            const characterId = urlParts[urlParts.length - 1];
            try {
                const character = await this.characterService.getById(parseInt(characterId));

                if (character) {
                    const species = character.species;
                    speciesCount[species] = (speciesCount[species] || 0) + 1;
                }
            } catch (error) {
                console.log(`Failed to get character by ID ${characterId}:`, error);
            }
        }

        const seriesData = [];

        for (const [species, count] of Object.entries(speciesCount)) {
            seriesData.push({ name: species, y: count });
        }

        const pieChart = {
            chart: {
                type: 'pie',
            },
            title: {
                text: `Species distribution in ${location.name}`,
            },
            series: [
                {
                    name: 'Species',
                    data: seriesData,
                },
            ],
        };

        return pieChart;
    }

    public async getLocationPieChartEpisodes(id: number) {
        const location = await this.locations.findOne({ where: { id: id } });

        if (!location) {
            throw new Error('Location not found');
        }

        const residentUrls = location.residents;
        const episodeCount = {};

        for (const url of residentUrls) {
            const urlParts = url.split('/');
            const characterId = urlParts[urlParts.length - 1];

            try {
                const character = await this.characterService.getById(parseInt(characterId))
                if (character) {
                    for (const episodeUrl of character.episode) {
                        const episodeUrlParts = episodeUrl.split('/');
                        const episodeId = episodeUrlParts[episodeUrlParts.length - 1];
                        const episode = await this.episodeService.getById(parseInt(episodeId))

                        if (episode) {
                            const episodeName = episode.name;
                            episodeCount[episodeName] = (episodeCount[episodeName] || 0) + 1;
                        }
                    }
                }
            } catch (error) {
                console.log(`Failed to get character by ID ${characterId}:`, error);
            }

        }

        const seriesData = [];

        for (const [episodeName, count] of Object.entries(episodeCount)) {
            seriesData.push({ name: episodeName, y: count });
        }

        const pieChart = {
            chart: {
                type: 'pie',
            },
            title: {
                text: `Character per episode distribution for location ${location.name}`,
            },
            series: [
                {
                    name: 'Characters from this location',
                    data: seriesData,
                },
            ],
        };

        return pieChart;
    }

    public async deleteLocation(id: number) {
        const location = await this.locations.findOne({ where: { id: id } });
        if (!location) {
            throw new NotFoundException(`Location with id ${id} not found`);
        }

        await this.locations.delete(id)

        return this.getAll(1)
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
