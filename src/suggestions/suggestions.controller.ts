import { Controller, Param, Post, Body, Get, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDTO } from 'src/dto/create-suggestion.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('suggestion')
export class SuggestionsController {

    constructor(
        private readonly suggestionsService: SuggestionsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllSuggestions() {
        return await this.suggestionsService.getAllSuggestions()
    }

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async addSuggestion(@Body() newSuggestion: CreateSuggestionDTO) {
        return await this.suggestionsService.createSuggestion(newSuggestion)
    }

    @UseGuards(JwtAuthGuard)
    @Put('/approve/:id/user/:userId')
    async addApprove(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
        return await this.suggestionsService.addApprove(id, userId)
    }

}