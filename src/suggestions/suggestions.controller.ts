import { Controller, Post, Body, Get } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDTO } from 'src/models/create-suggestion.dto';
import { Suggestion } from 'src/db_models/Suggestion';

@Controller('suggestion')
export class SuggestionsController {

    constructor(
        private readonly suggestionsService: SuggestionsService,
    ) { }

    @Get()
    async getAllSuggestions(): Promise<Suggestion[]> {
        return await this.suggestionsService.getAllSuggestions()
    }

    @Post('/add')
    async addSuggestion(@Body() newSuggestion: CreateSuggestionDTO) {
        return await this.suggestionsService.createSuggestion(newSuggestion)
    }
}