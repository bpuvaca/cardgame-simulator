function bpm(
u: number,
	visited: boolean[],
  	matchR: number[],
  	graph: number[][]
): boolean {
  	for (const v of graph[u]) {
    	if (!visited[v]) {
      		visited[v] = true;

			if (matchR[v] === -1 || bpm(matchR[v], visited, matchR, graph)) {
				matchR[v] = u;
				return true;
			}
    	}
  	}
  	return false;
}

export function normalizeIdLists(lists: string[][]): {
	normalized: number[][],
	cardCount: number
} {
	const maxCounts = new Map<string, number>();

	for (const list of lists) {
		const countMap = new Map<string, number>();
		for (const val of list) {
			countMap.set(val, (countMap.get(val) ?? 0) + 1);
		}
		for (const [val, count] of countMap.entries()) {
			maxCounts.set(val, Math.max(maxCounts.get(val) ?? 0, count));
		}
	}

	const idMap = new Map<string, number>();
	let nextId = 0;

	for (const [val, count] of maxCounts.entries()) {
		for (let i = 0; i < count; i++) {
			idMap.set(`${val}#${i}`, nextId++);
		}
	}

	const normalized: number[][] = [];

	for (const list of lists) {
		const counter = new Map<string, number>();
		const normList: number[] = [];

		for (const val of list) {
			const idx = counter.get(val) ?? 0;
			const id = idMap.get(`${val}#${idx}`);
			if (id === undefined) {
				throw new Error(`Invalid mapping for value: ${val}#${idx}`);
			}
			normList.push(id);
			counter.set(val, idx + 1);
		}

		normalized.push(normList);
	}

	return {
		normalized,
		cardCount: nextId
	};
}


export function hasPerfectMatching(groupMembers: string[][]): boolean {
	const groupCount = groupMembers.length;
	
	const { normalized, cardCount } = normalizeIdLists(groupMembers);

	if (cardCount < groupCount) {
		return false;
	}

	const matchR: number[] = new Array(cardCount).fill(-1);
	let matchCount = 0;

	for (let u = 0; u < groupCount; u++) {
		const visited: boolean[] = new Array(cardCount).fill(false);
		if (bpm(u, visited, matchR, normalized)) {
			matchCount++;
		}
	}

	return matchCount === groupCount;
}

function arraysEqual(a: number[], b: number[]): boolean {
	return a.length === b.length && a.every((val, i) => val === b[i]);
}

function testNormalize() {
	const input = [
		["123", "123", "567"],
		["123", "123"],
		["567", "789", "789"],
		["789", "789"],
	];

	const {normalized, cardCount} = normalizeIdLists(input);

	// Expected: [ [0, 1, 2], [0, 1], [2, 3] ]
	const expected = [
		[0, 1, 2],
		[0, 1],
		[2, 3, 4],
		[3, 4],
	];

	const allPass = normalized.length === expected.length &&
		normalized.every((row, i) => arraysEqual(row, expected[i])) &&
		cardCount === 5;

	if (allPass) {
		console.log("✅ Test passed!");
	} else {
		console.error("❌ Test failed!");
		console.log("Expected:", expected);
		console.log("Got:", normalized);
		console.log("Expected cardCount:", 5);
		console.log("Got cardCount:", cardCount);
	}
}

//testNormalize();