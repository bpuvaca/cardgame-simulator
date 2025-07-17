import { Condition, ConditionMember, DrawCardsMap, YGOCard} from '../types/cards';
import { hasPerfectMatching } from './matching';

function buildEquivalenceMap(equivalences: string[][]): Record<string, string> {
    const map = {} as Record<string, string>;

    for (const group of equivalences) {
        if (group.length === 0) continue;
        const representative = group[0];
        for (const value of group) {
            map[value] = representative;
        }
    }

    return map;
}

function isADrawCard(card: string, drawCards: DrawCardsMap): boolean {
    return Object.keys(drawCards).includes(card);
}

function findFirstPriorityCardIndex(hand: string[], priority: string[]): number {
    for (let p = 0; p < priority.length; p++) {
        const idx = hand.indexOf(priority[p]);
        if (idx !== -1) {
            return idx;
        }
    }
    return -1;
}

//modifies the hand, but not the deck, returns amount of cards drawn, only does one draw card
function performComplexCardDraw(deck: string[], topIndex: number, hand: string[], drawCards: DrawCardsMap): number {
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (isADrawCard(card, drawCards) && drawCards[card].type !== "simple") {
            const amount = drawCards[card].amount;
            const removesCard = drawCards[card].removesCard;
            const priority = drawCards[card].priority;
            const type = drawCards[card].type;
            let idx = findFirstPriorityCardIndex(hand, priority);
            if (idx !== -1) {
                hand.splice(i, 1);
                if (type === "draw_last") {
                    if (removesCard) {
                        let idx = findFirstPriorityCardIndex(hand, priority);
                        hand.splice(idx, 1);
                    }
                    for (let j = 0; j < amount && topIndex < deck.length; j++, topIndex++) {
                        hand.push(deck[topIndex]);
                    }
                    return amount;
                }
                else if (type === "draw_first") {
                    for (let j = 0; j < amount && topIndex < deck.length; j++, topIndex++) {
                        hand.push(deck[topIndex]);
                    }
                    if (removesCard) {
                        idx = findFirstPriorityCardIndex(hand, priority);
                        hand.splice(idx, 1);
                    }
                    return amount;
                }
            }
        }
    }
    return 0;
}

//modifies the hand, but not the deck, returns amount of cards drawn
function performSimpleCardDraw(deck: string[], topIndex: number, hand: string[], drawCards: DrawCardsMap): number {
    let cardsDrawn = 0;
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (isADrawCard(card, drawCards) && drawCards[card].type === "simple") {
            const amount = drawCards[card].amount;
            // remove the draw card from hand
            hand.splice(i, 1);
            i--; 
            for (let j = 0; j < amount && topIndex < deck.length; j++, topIndex++) {
                hand.push(deck[topIndex]);
                cardsDrawn++;
            }
        }
    }
    return cardsDrawn;
}

function assignGroupings(hand: string[], conditionMembers: ConditionMember[], equivalenceMap: Record<string, string>, useOnce: Record<string, boolean>): string[][] {
    let groupings: string[][] = [];
    for (const member of conditionMembers) {
        const group = member.group;
        let groupMembersInHand: string[] = [];
        for (let card of hand) {
            card = equivalenceMap[card] ?? card;
            let once = useOnce[card];
            if (group.members.includes(card)) {
                if (once) {
                    if (!groupMembersInHand.includes(card)) {
                        groupMembersInHand.push(card);
                    }
                } else {
                    groupMembersInHand.push(card);
                }
            }
        }
        for (let i = 0; i < member.count; i++) {
            groupings.push(groupMembersInHand);
        }
    }
    return groupings;
}   

function checkCondition(hand: string[], condition: Condition, equivalenceMap: Record<string, string>, useOnce: Record<string, boolean>): boolean {
    //check nullifying members first
    for (const member of condition.OrSeparatedNullifyingMembers) {
        const group = member.group;
        let count = 0;
        for (const card of group.members) {
            if (hand.includes(card)) {
                count++;
            }
        }
        if (count >= member.count) return false;
    }

    let groupings = assignGroupings(hand, condition.AndSeparatedPositiveMembers, equivalenceMap, useOnce);
    return hasPerfectMatching(groupings);
}

function anyConditionsMatch(hand: string[], conditions: Condition[], equivalenceMap: Record<string, string>, useOnce: Record<string, boolean>): boolean {
    for (const condition of conditions) {
        if (checkCondition(hand, condition, equivalenceMap, useOnce)) return true;
    }
    return false;
}	

//main function, assumes shuffled deck and equivalent groupings to be consistent
export function evaluateSim(deck: YGOCard[], conditions: Condition[], equivalences: string[][], useOnce: Record<string, boolean>, drawCards: DrawCardsMap) : boolean {
    let equivalenceMap = buildEquivalenceMap(equivalences);
    let deckIds = deck.map(card => card.id);
    
    let hand = deckIds.slice(0, 5);
    let topIndex = 5;

    topIndex += performSimpleCardDraw(deckIds, topIndex, hand , drawCards);
    let allDrawChecksPerformed = false;
    while (!allDrawChecksPerformed) {
        console.log("Checking hand: ", hand);
        if (anyConditionsMatch(hand, conditions, equivalenceMap, useOnce)) return true;
        allDrawChecksPerformed = true;
        let drawn = performComplexCardDraw(deckIds, topIndex, hand, drawCards);
        if (drawn > 0) {
            topIndex += drawn + performSimpleCardDraw(deckIds, topIndex, hand, drawCards);
            allDrawChecksPerformed = false;
        }
    }
    return false;
}

