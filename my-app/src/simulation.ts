import {Deck, Card} from './cards.js';

interface Config {
    handSize: number;
}

type Condition = string[]; // Each condition is an array of card names.

class Simulation {
    deck: Deck;
    hand: Card[] = [];
    grave: Card[] = [];
    stateMap: Record<string, any> = {};
    config: Config;
    conditions: Condition[];
    conditionMet: boolean = false;

    constructor(deck: Deck, config: Config, conditions: Condition[]) {
        this.deck = deck;
        this.config = config;
        this.conditions = conditions;
        this.conditionMet = false;

        for (const card of this.deck.cards) {
            card.setSimulation(this);
        }

        this.drawStartingHand();
    }

    drawCard(): void {
        const card = this.deck.drawCard();
        if (!card) return;
        this.hand.push(card);
        card.onDraw();
        this.checkConditions();
    }

    drawCards(n: number): void {
        let cards: Card[] = [];
        for (let i = 0; i < n; i++) {
            const card = this.deck.drawCard();
            if (!card) break;
            cards.push(card);
        }
        this.hand.push(...cards);
        cards.forEach(card => card.onDraw());
        this.checkConditions();
    }

    drawStartingHand(): void {
        this.drawCards(this.config.handSize);
    }

    discardCard(id: number): void {
        let card = this.hand.splice(id, 1)[0];
        this.grave.push(card);
        card.onSentToGrave();
    }

    searchCard(name: string): void {
        let card = this.deck.cards.find(card => card.name === name);
        if (card) {
            this.deck.cards = this.deck.cards.filter(c => c.id !== card.id);
            this.hand.push(card);
            card.onDraw();
            this.checkConditions();
        }
    }

    millCards(n: number): void {
        let cards = this.deck.cards.splice(0, n);
        this.grave.push(...cards);
        cards.forEach(card => card.onSentToGrave());
    }

    checkConditions(): void {
        let handCardNames = this.hand.map(card => card.name);
        for (const condition of this.conditions) {
            let check = true;
            for (const name of condition) {
                if (!handCardNames.includes(name)) {
                    check = false;
                }
            }
            if (check) {
                this.conditionMet = true;
                return;
            }
        }
    }
}

export default Simulation;