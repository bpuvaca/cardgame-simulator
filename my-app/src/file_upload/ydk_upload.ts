import fs from 'fs';
import { DeckList, YGOCard, YGOCardMap } from '../types/cards';

const data_path = "../../../cards_data/card_data.json";

export function parseYdk(ydkPath: string): DeckList {
    let ids: string[] = [];
    const lines = fs.readFileSync(ydkPath, 'utf-8').split('\n');
    
    for (const line of lines) {
        if (/^\d/.test(line.trim())) {
            ids.push(line.trim());
        }
    }

    const data = JSON.parse(fs.readFileSync(data_path, 'utf-8'));
    const cards = data.data as YGOCard[];

    const used_cards: YGOCardMap = {};
    for (let card of cards) {
        card.id = String(card.id);
        if (ids.includes(card.id)) {
            used_cards[card.id] = {
                id: String(card.id),
                name: card.name,
                type: card.type,
            };
        }
    }

    const decklist: DeckList = {
        main: { cards: [], count: 0 },
        extra: { cards: [], count: 0 },
        side: { cards: [], count: 0 },
    };

    let current_type: keyof DeckList = "main";

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === "#extra") {
            current_type = "extra";
        } else if (trimmedLine === "!side") {
            current_type = "side";
        } else if (/^\d/.test(trimmedLine)) {
            const card = used_cards[trimmedLine];
            if (card) {
                decklist[current_type].cards.push(card);
                decklist[current_type].count++;
            }
        }
    }

    return decklist;
}