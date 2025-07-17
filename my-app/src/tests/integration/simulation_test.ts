import { evaluateSim } from "../../computation/calculate";
import { parseYdk } from "../../file_upload/ydk_upload";
import { Condition, DeckSection, DrawCard, YGOCard } from "../../types/cards";

const equivalenceForWitchWanted = ["80845034", "72270339"]
const handtrapGroup = {
    name: "handtraps",
    members: [
        "veiler",
        "nib",
        "imperm",
    ]
}

// remove wanted later
const starterGroup = {
    name: "starters",
    members: [
        "witch", // witch
        "snash", // snash
        "wanted", // wanted
    ]
}

const conditionStarter : Condition = {
    AndSeparatedPositiveMembers: [
        {
            group: starterGroup,
            count: 1
        }
    ],
    OrSeparatedNullifyingMembers: []
}

const conditionStarter2xHandtraps : Condition = {
    AndSeparatedPositiveMembers: [
        {
            group: handtrapGroup,
            count: 2
        },
        {
            group: starterGroup,
            count: 1
        }
    ],
    OrSeparatedNullifyingMembers: []
}

const condition2xStarter2xHandtraps : Condition = {
    AndSeparatedPositiveMembers: [
        {
            group: handtrapGroup,
            count: 2
        },
        {
            group: starterGroup,
            count: 2
        }
    ],
    OrSeparatedNullifyingMembers: []
}

function cardSwap(arr: YGOCard[], i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

function arrange2xVeiler2xWantedWitch(deck: YGOCard[]) {
    cardSwap(deck, 0, 15);
    cardSwap(deck, 1, 16);
    cardSwap(deck, 2, 30);
    cardSwap(deck, 3, 31);
    cardSwap(deck, 4, 8);
}

function testSetup(): { main: YGOCard[]; useOnce: { [key: string]: boolean } } {
    let decklist = parseYdk("../test-se.ydk");
    let main = decklist.main.cards;
    console.log(main);
    let useOnce: { [key: string]: boolean } = {};

    for (let i = 0; i < main.length; i++) {
        useOnce[main[i].id] = true;
    }

    useOnce["97268402"] = false; // veiler can be used multiple times
    return { main, useOnce };
}

function testNoDraw(){
    let { main, useOnce } = testSetup();

    arrange2xVeiler2xWantedWitch(main);
    let goodSim = evaluateSim(main, [conditionStarter2xHandtraps], [equivalenceForWitchWanted], useOnce, {});
    console.log(goodSim ? "Starter + 2x Handtraps test passed!" : "Starter + 2x Handtraps test failed!");

    let badSim = evaluateSim(main, [condition2xStarter2xHandtraps], [equivalenceForWitchWanted], useOnce, {});
    console.log(badSim ? "2x Starter + 2x Handtraps test failed!" : "2x Starter + 2x Handtraps test passed!");
}

const drawOneDrawCard : DrawCard = {
    id: "draw_one",
    amount: 1,
    type: "simple",
}

const drawOneYGOCard: YGOCard = {
    id: "draw_one",
    name: "Draw One Card",
    type: "Spell",
}

function arrangeSimpleDrawExample(deck: YGOCard[]) {
    deck[4] = drawOneYGOCard;
    deck[5] = drawOneYGOCard;
    deck[6] = drawOneYGOCard;
    cardSwap(deck, 0, 7); // ash to 7th
}

function testDrawSimple() {
    let { main, useOnce } = testSetup();
    arrangeSimpleDrawExample(main);
    let drawCards: { [key: string]: DrawCard } = {
        "draw_one": drawOneDrawCard,
    };
    let goodSim = evaluateSim(main, [conditionStarter], [], useOnce, drawCards);
    console.log(goodSim ? "Simple Draw test passed!" : "Simple Draw test failed!");
}

const drawTwoRemoveOakAsh: DrawCard = {
    id: "d2_oak_ash",
    amount: 2,
    type: "draw_first",
    removesCard: true,
    priority: ["45663742", "9674034"], // oak, ash
}

const drawTwoRemoveOakAshYGOCard: YGOCard = {
    id: "d2_oak_ash",
    name: "Draw Two (Remove Oak, Ash)",
    type: "Spell",
}

// the order is ash, ash, draw1, veiler, blank, draw2, blank, draw2, oak, draw1, veiler
// the goal is to test if checking for priority after draw works correctly,
// along with simple draw working when weaved between complex draws
function arrangeDrawComplexExample(deck: YGOCard[]) {
    
    //veilers
    cardSwap(deck, 15, 3);
    cardSwap(deck, 16, 10);
    //oak
    cardSwap(deck, 7, 8);
    //draw
    deck[2] = deck[9] = drawOneYGOCard;
    deck[5] = deck[7] = drawTwoRemoveOakAshYGOCard
}

function testDrawComplex() {
    let { main, useOnce } = testSetup();
    arrangeDrawComplexExample(main);
    let drawCards: { [key: string]: DrawCard } = {
        "draw_one": drawOneDrawCard,
        "d2_oak_ash": drawTwoRemoveOakAsh,
    };
    let goodSim = evaluateSim(main, [conditionStarter2xHandtraps], [], useOnce, drawCards);
    console.log(goodSim ? "Complex Draw test passed!" : "Complex Draw test failed!");
}

testNoDraw();
testDrawSimple();
testDrawComplex();