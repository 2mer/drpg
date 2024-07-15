import { produce } from "immer";
import { tierPip } from "../../components/NumberRenderer";
import { GameState } from "../../hooks/useGameState";

function last<T extends any[]>(arr: T) {
	return arr[arr.length - 1];
}

const images = Object.fromEntries(
	Object.entries(
		import.meta.glob<true, string, string>('../../assets/tiles/*.png', { eager: true, import: 'default' })
	).map(([key, value]) => [last(key.split('/')).replace('.png', ''), value])
)

const items = Object.fromEntries(
	Object.entries(
		import.meta.glob<true, string, string>('../../assets/items/*.png', { eager: true, import: 'default' })
	).map(([key, value]) => [last(key.split('/')).replace('.png', ''), value])
)

export type ITile = {
	id: string;
	name: string;
	image: string;
	toughness: number;
	score: number;

	[key: string]: any;
};

function currency(id: string): ITile {
	const nId = id + 'Currency';
	return {
		id: nId,
		name: id + ' currency',
		image: images[nId],
		score: 0,
		toughness: 0,
	}
}

const tiles = {

	drill: {
		id: 'drill',
		name: 'Drill',
		image: images.drill_01,
		toughness: -1,
		score: 0,
	},

	air: {
		id: 'air',
		name: 'Air',
		image: images.air,
		toughness: 0,
		score: 0,

	},

	dirt: {
		id: 'dirt',
		name: 'Dirt',
		image: images.dirt,
		toughness: 1,
		score: 1,

	},

	box: {
		id: 'box',
		name: 'Box',
		image: images.box,
		toughness: 1,
		score: 10,
	},

	stone: {
		id: 'stone',
		name: 'Stone',
		image: images.stone,
		toughness: 2,
		score: 2,
	},

	stoneSecret: {
		id: 'stoneSecret',
		name: 'Stone',
		image: images.stoneSecret,
		toughness: 3,
		score: 50,
	},

	gold: {
		id: 'gold',
		name: 'Gold',
		image: images.gold,
		toughness: 2,
		score: 5,
	},

	stone2: {
		id: 'stone2',
		name: 'Stone 2',
		image: images.stone2,
		toughness: 5,
		score: 2,
	},

	diamond: {
		id: 'diamond',
		name: 'Diamond',
		image: images.diamond,
		toughness: 3,
		score: 10,
	},

	stone3: {
		id: 'stone3',
		name: 'Stone 3',
		image: images.stone3,
		toughness: 10,
		score: 2,
	},

	fossil: {
		id: 'fossil',
		name: 'Fossil',
		image: images.fossil,
		toughness: 10,
		score: 25,
	},

	stone4: {
		id: 'stone4',
		name: 'Stone 4',
		image: images.stone4,
		toughness: 25,
		score: 2,
	},

	snow: {
		id: 'snow',
		name: 'Snow',
		image: images.snow,
		toughness: 1,
		score: 0,
	},

	ice: {
		id: 'ice',
		name: 'Ice',
		image: images.ice,
		toughness: 2,
		score: 0,
	},

	jungle: {
		id: 'jungle',
		name: 'Jungle',
		image: images.jungle,
		toughness: 2,
		score: 0,
	},

	homePortal: {
		id: 'homePortal',
		name: 'Home Portal',
		image: images.homePortal,
		toughness: 0,
		score: 0,

		portalTo: {
			dimension: 'hangar',
			x: 2,
			y: 0,
		}
	},

	overworldPortal: {
		id: 'overworldPortal',
		name: 'Overworld Portal',
		image: images.overworldPortal,
		toughness: 0,
		score: 0,

		portalTo: {
			dimension: 'overworld',
			x: 2,
			y: -5,
		}
	},

	storePortal: {
		id: 'storePortal',
		name: 'Store Portal',
		image: images.storePortal,
		toughness: 0,
		score: 0,

		portalTo: {
			dimension: 'hangar',
			x: 2,
			y: 0,
		}
	},

	hangar: {
		id: 'hangar',
		name: 'Hangar wall',
		image: images.hangar,
		toughness: Infinity,
		score: 0,
	},


	whiteCurrency: currency('white'),
	greenCurrency: currency('green'),
	blueCurrency: currency('blue'),
	purpleCurrency: currency('purple'),
	magentaCurrency: currency('magenta'),
	redCurrency: currency('red'),
	orangeCurrency: currency('orange'),

	woodenShield: Shop({
		id: 'woodenShield',
		name: 'Wooden Shield',
		image: items.woodenShield,
		price: tierPip(0) * 5,
		onBuy(state) {
			state.stats.armor += 1;
		},
		score: 0,
		toughness: 0,
	})


} satisfies { [key: string]: ITile }

export function isPlayer(tile: ITile) {
	return tile.id === tiles.drill.id;
}

export default tiles;

export type IPortal = ITile & { portalTo: { dimension: string, x: number, y: number } };
export function isPortal(tile: ITile): tile is IPortal {
	return 'portalTo' in tile;
}

export type IShop = ITile & { price: number, onBuy: (state: GameState) => void };
export function isShop(tile: ITile): tile is IShop {
	return 'price' in tile;
}

export function Shop(shop: IShop) {
	return shop;
}

export function storePortal(dimension: string) {
	return produce(tiles.storePortal, draft => {
		draft.portalTo.dimension = dimension;
	})
}