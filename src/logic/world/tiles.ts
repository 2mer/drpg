function last<T extends any[]>(arr: T) {
	return arr[arr.length - 1];
}

const images = Object.fromEntries(
	Object.entries(
		import.meta.glob<true, string, string>('../../assets/tiles/*.png', { eager: true, import: 'default' })
	).map(([key, value]) => [last(key.split('/')).replace('.png', ''), value])
)

export type ITile = {
	id: string;
	name: string;
	image: string;
	toughness: number;
	score: number;
};


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

	homePortal: {
		id: 'homePortal',
		name: 'Home Portal',
		image: images.homePortal,
		toughness: 0,
		score: 0,
	}


} satisfies { [key: string]: ITile }

export function isPlayer(tile: ITile) {
	return tile.id === tiles.drill.id;
}

export default tiles;