import {Card, Deck, Cantrip} from './cards.js';
import Simulation from './simulation.js';

let c = 0;
let n = 1000000;

for (let i = 0; i < n; i++) {
    const card1 = new Card('1', 0);
    const card2 = new Card('2', 1);
    const card3 = new Card('3', 2);
    let cards = [card1,card2,card3];
    for (let j = 3; j < 8; j++) {
        //cards.push(new Cantrip('Cantrip', j));
    }
    const deck = new Deck(cards, 40);
    let simulation = new Simulation(deck, {handSize: 5}, [['1']]);
    if (simulation.conditionMet) {
        c++;
    } 
}

console.log((c / n * 100).toFixed(2) + '%');

