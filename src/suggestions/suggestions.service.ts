import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Suggestion } from 'src/db_models/Suggestion';
import { CreateSuggestionDTO } from 'src/models/create-suggestion.dto';
import { SentSuggestion } from 'src/models/suggestion-sent.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class SuggestionsService {

    constructor(
        @InjectRepository(Suggestion)
        private readonly suggestions: Repository<Suggestion>,
        private readonly userService: UsersService,
    ) { }

    public async createSuggestion(newSuggestion: CreateSuggestionDTO) {
        const suggestion = this.suggestions.create(newSuggestion)
        suggestion.approve_users_id = []
        await this.suggestions.save(suggestion)
        const newSuggestions = await this.getAllSuggestions()
        return newSuggestions
    }

    public async getAllSuggestions() {
        const suggestions = await this.suggestions.find();
        const sentSuggestions = await this.transformSuggestions(suggestions)
        return sentSuggestions;
    }

    public async addApprove(id: number, userId: number) {
        const suggestion = await this.suggestions.findOne({ where: { id: id } });
        if (!suggestion.approve_users_id) {
            suggestion.approve_users_id = []
        }
        if (suggestion.approve_users_id.includes(userId)) {
            suggestion.approvals -= 1
            suggestion.approve_users_id = suggestion.approve_users_id.filter(id => id !== userId)
            await this.suggestions.update(suggestion.id, suggestion)
            const allSuggestions = await this.suggestions.find()
            return await this.transformSuggestions(allSuggestions)
        }
        suggestion.approvals += 1
        suggestion.approve_users_id.push(userId)
        await this.suggestions.update(suggestion.id, suggestion)
        const newSuggestions = await this.suggestions.find()
        return await this.transformSuggestions(newSuggestions)
    }

    private async transformSuggestions(suggestions: Suggestion[]) {
        const sentSuggestions: SentSuggestion[] = [];
        const userTotal = await this.userService.userCount();

        for (const suggestion of suggestions) {
            const splittedUrl = suggestion.creator.split('/');
            const userId = splittedUrl[splittedUrl.length - 1];
            const user = await this.userService.findOne(parseInt(userId));
            if (!user) {
                continue
            }
            const creatorName = `${user.lastname} ${user.firstname}`;
            const approval_rate = suggestion.approvals / userTotal * 100
            const sentSuggestion = {
                ...suggestion,
                creator: creatorName,
                isCreatorActive: user.isActive,
                approval_rate: approval_rate
            };
            // delete sentSuggestion.approve_users_id
            sentSuggestions.push(sentSuggestion);
        }

        return sentSuggestions;
    }
}
