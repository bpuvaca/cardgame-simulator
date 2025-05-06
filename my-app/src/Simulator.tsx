import { useState } from "react";
import Simulation from './simulation';
import {Deck, Card} from './cards.js';


export default function CardGameSimulator() {
  const [handSize, setHandSize] = useState(5);
  const [deckSize, setDeckSize] = useState(40);
  const [simulations, setSimulations] = useState(1000);
  const [cardList, setCardList] = useState("");
  const [conditions, setConditions] = useState("");
  const [result, setResult] = useState("");

  const handleRunSimulation = () => {
		let itemizedCards = cardList.split('\n');
		let parsedCards = itemizedCards.map(card => {
			let [count, ...nameParts] = card.split('x');
			let name = nameParts.join('x').trim();
			return { count: parseInt(count.trim()), name };
		});
		
		
		let itemizedConditions = conditions.split('\n');
		let parsedConditions = itemizedConditions.map(condition => condition.split(',').map(c => c.trim()));

		let successes = 0;
		for (let i = 0; i < simulations; i++) {
			let cards = [];
			let k = 0;

			for (let card of parsedCards) {
				for (let j = 0; j < card.count; j++) {
					cards.push(new Card(card.name, k++));
				}
			}
			const deck = new Deck(cards, deckSize);
			//deck.printCardNames();
			
			const simulation = new Simulation(deck, {handSize}, parsedConditions);
			if (simulation.conditionMet) {
				successes++;
			}
		}

		const successRate = ((successes / simulations) * 100).toFixed(2);
		setResult(`Success Rate: ${successRate}%`);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl space-y-4">
      <h2 className="text-2xl font-bold text-center">TCG Simulator</h2>
      
    <div className="flex flex-col gap-4">
      <div className="">
        <span className="text-base font-medium">Starting Hand Size:</span>
        <input
        type="number"
        className="w-full p-2 border rounded-lg"
        value={handSize}
        onChange={(e) => setHandSize(Number(e.target.value))}
        />
    	</div>
      	<div className="">
        	<span className="text-base font-medium">Deck Size:</span>
        <input
					type="number"
					className="w-full p-2 border rounded-lg"
					value={deckSize}
					onChange={(e) => setDeckSize(Number(e.target.value))}
					/>
			</div>
      <div className="">
        <span className="text-base font-medium">Number of Simulations:</span>
        <select
        className="w-full p-2 border rounded-lg"
        value={simulations}
        onChange={(e) => setSimulations(Number(e.target.value))}
        >
        {[1000, 10000, 100000, 1000000].map((count) => (
          <option key={count} value={count}>{count}</option>
        ))}
        </select>
      </div>
    </div>
      
		<div className="flex flex-row gap-4">
			<div className="w-1/2 flex flex-col">
				<label className="mb-2 font-medium">Card List:</label>
				<textarea
					className="p-2 border rounded-lg"
					placeholder={`4x Card A\n3x Card B`}
					value={cardList}
					onChange={(e) => setCardList(e.target.value)}
				></textarea>
			</div>
			<div className="w-1/2 flex flex-col">
				<label className="mb-2 font-medium">Success Conditions:</label>
				<textarea
					className="p-2 border rounded-lg"
					placeholder={`Card A, Card B\nCard C, Card D`}
					value={conditions}
					onChange={(e) => setConditions(e.target.value)}
				></textarea>
			</div>
		</div>
      <button
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 text-lg"
        onClick={handleRunSimulation}
      >
        Run Simulation
      </button>
      
      {result && <div className="text-center text-xl font-bold mt-4">{result}</div>}
    </div>
  );
}
