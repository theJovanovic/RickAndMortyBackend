export class Card {

    static idCounter: number = 0
    id: number
    flipped: boolean

    constructor(public characterImage: string, public characterId: number) {
        Card.idCounter += 1
        this.id = Card.idCounter
        this.flipped = false
    }
    
}