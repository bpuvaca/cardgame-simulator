export type YGOCard = {
    id: string;
    name: string;
    type: string;
}

export type YGOCardMap = Record<string, YGOCard>;

export type DeckSection = {
    cards: YGOCard[];
    count: number;
};

export type DeckList = {
    main: DeckSection;
    extra: DeckSection;
    side: DeckSection;
};

export type Group = {
    name: string;
    members: string[];
}

export type ConditionMember = {
    group: Group;
    count: number;
}

export type DrawCardsMap = Record<string, DrawCard>;

export type DrawCard =
	| {
		id: string;
		amount: number;
		type: "simple";
	}
	| {
		id: string;
		amount: number;
		type: "draw_first" | "draw_last";
		removesCard: boolean;
		priority: string[];
	};

export type Condition = {
    AndSeparatedPositiveMembers: ConditionMember[];
    OrSeparatedNullifyingMembers: ConditionMember[];
};