import { Controller, Param, Post, Body, Get, Put, ParseIntPipe } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDTO } from 'src/models/create-suggestion.dto';

@Controller('suggestion')
export class SuggestionsController {

    constructor(
        private readonly suggestionsService: SuggestionsService,
    ) { }

    @Get()
    async getAllSuggestions() {
        return await this.suggestionsService.getAllSuggestions()
    }

    @Post('/add')
    async addSuggestion(@Body() newSuggestion: CreateSuggestionDTO) {
        return await this.suggestionsService.createSuggestion(newSuggestion)
    }

    @Put('/approve/:id/user/:userId')
    async addApprove(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
        return await this.suggestionsService.addApprove(id, userId)
    }

}