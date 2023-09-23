import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from 'src/db_models/Suggestion';
import { CreateSuggestionDTO } from 'src/models/create-suggestion.dto';
import { Repository } from 'typeorm';

@Injectable()
export class SuggestionsService {

    constructor(
        @InjectRepository(Suggestion)
        private readonly suggestions: Repository<Suggestion>,
    ) { }

    public async createSuggestion(newSuggestion: CreateSuggestionDTO) {
        const suggestion = this.suggestions.create(newSuggestion)
        await this.suggestions.save(suggestion)
        return await this.getAllSuggestions()
    }

    public async getAllSuggestions(): Promise<Suggestion[]> {
        const suggestions = await this.suggestions.find()
        return suggestions
    }
}
