import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards, Put, Delete } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { Episode } from 'src/db_models/Episode';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { UserRole } from 'src/db_models/User';
import { Roles } from 'src/auth/roles.decorator';

@Controller('episode')
export class EpisodesController {

    constructor(
        private readonly episodesService: EpisodesService,
    ) { }

    // @Get('/fetchAndSave')
    // async fetchAndSaveCharacters() {
    //     await this.episodesService.fetchAndSaveCharacters();
    //     return 'Data fetched and saved successfully';
    // }

    // @Get('/updateUrls')
    // async updateUrls() {
    //     await this.episodesService.updateEpisodeUrls();
    //     return 'Data updated successfully';
    // }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN)
    @Delete('/admin/:id')
    public async deleteEpisode(@Param('id', ParseIntPipe) id: number) {
        return this.episodesService.deleteEpisode(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/like/:id/user/:userId')
    async likeEpisode(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
        return await this.episodesService.incrementLikes(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/dislike/:id/user/:userId')
    async dislikeEpisode(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
        return await this.episodesService.incrementDislikes(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:ids')
    async getByIds(@Param('ids') ids: string): Promise<Episode[]> {
        const idArray = ids.split(',').map(id => Number(id));
        return this.episodesService.getByIds(idArray);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getEpisodeById(@Param('id', ParseIntPipe) id: number) {
        return await this.episodesService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllEpisodes(@Query('page') page: number) {
        return await this.episodesService.getAll(page);
    }


}
