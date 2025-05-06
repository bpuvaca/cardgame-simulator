import Simulation from './simulation';

class Card {
    name: string;
    id: number;
    simulation: Simulation | undefined;

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
        this.simulation = undefined; // Initialize simulation as undefined
    }

    setSimulation(simulation: Simulation): void {
        this.simulation = simulation;
    }

    onDraw(): void {
        //console.log(`Card ${this.name} was drawn`);
    }

    onSentToGrave(): void {
    }

    playSelf(): void {
        if (this.simulation) {
            this.simulation.discardCard(this.id);
        }
    }
}

class Cantrip extends Card {
    constructor(name: string, id: number) {
        super(name, id);
    }

    onDraw(): void {
        if (this.simulation) {
            this.simulation.drawCard();
            this.playSelf();
        }
    }
}

class Deck {
    cards: Card[];
    size: number;

    constructor(cards: Card[], size: number) {
        this.cards = cards;
        this.size = size;

        for (let i = cards.length; i < size; i++) {
            this.cards.push(new Card('Blank', i));
        }

        this.shuffle();
    }

    shuffle(): void {
        for (let i = this.size - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard(): Card | undefined {
        return this.cards.pop();
    }

    printCardNames(): void {
        console.log(this.cards.map(card => card.name));
    }
}

export { Card, Deck, Cantrip };
