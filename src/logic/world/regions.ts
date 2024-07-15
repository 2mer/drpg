import { getWeighted } from "./generation";
import { R21 } from "./random";
import tiles, { IShop, ITile, storePortal } from "./tiles";
import infoTexture from '../../assets/ui/info.png';
import skyTexture from '../../assets/tiles/sky.png';
import { group, mapValues } from "radash";
import { BARS } from "../../components/NumberRenderer";

export type Region = {
	id: string;
	image: string;
	background?: string;
	name: string;
	contains: (x: number, y: number) => boolean;
	generateTile: (x: number, y: number) => ITile;
};

export function range(min: number, max: number) {
	return (_x: number, y: number) => y >= min && y <= max;
}

export function weights(w: [weight: number, item: ITile][]) {
	return (x: number, y: number) => getWeighted(R21(x, y), w);
}

export function structure(startY: number, struct: ITile[][]) {
	const height = struct.length;
	return {
		contains: range(startY, startY + height - 1),
		generateTile: (x: number, y: number) => {
			if (y < startY) return tiles.air;
			if (y >= startY + height) return tiles.air;

			const nY = y - startY;

			return struct[nY][x];
		}
	}
}

export function template<T extends Record<string, ITile | ITile[] | ((x: number, y: number, index: number) => ITile)>>(template: T, struct: (keyof T)[][]): ITile[][] {
	const idxMap = new Map<string, number>();

	return struct.map((row, j) => row.map((t, i) => {
		const e = template[t];
		const idx = idxMap.get(t as string) ?? 0;
		idxMap.set(t as string, idx + 1);

		if (typeof e === 'function') return e(i, j, idx);
		if (Array.isArray(e)) return e[idx % e.length];


		return e as ITile;
	}));
}

export function store({ currency, pipValue, items, ...rest }: Omit<Region, 'contains' | 'generateTile' | 'image'> & { currency: ITile, pipValue: number, items: IShop[] }) {

	const itemsByPrice = mapValues(group(items, i => i.price), v => (v ?? []).slice(0, 2));

	const shopRows = Array.from({ length: BARS - 1 }, (_, idx) => {
		const [item1, item2] = itemsByPrice?.[idx + 1] ?? [];

		return [item1 ? 's' : '#', ' ', ' ', ' ', item2 ? 's' : '#']
	})

	return [
		{
			...rest,

			image: currency.image,

			...structure(0, template(
				{
					' ': tiles.air,
					'#': tiles.hangar,
					'b': tiles.box,
					'h': tiles.homePortal,
					'o': tiles.overworldPortal,
					'c': currency,
					's': Object.values(itemsByPrice).flat(),
				}, [
				['h', 'c', ' ', 'c', 'h'],
				...(shopRows as any),

				['#', 'h', 'h', 'h', '#'],
			]
			))
		},
		{
			id: 'oob',
			name: 'oob',
			image: tiles.hangar.image,
			contains: () => true,
			generateTile: () => tiles.hangar,
		}
	];
}

let i;
export default {
	tutorial: [
		{
			id: 'spawn',
			name: 'Drop ship',
			image: infoTexture,
			contains: range(-Infinity, i = -1),
			generateTile: () => tiles.air,
		},
		{
			id: 'entrance',
			name: 'Entrance',
			image: infoTexture,
			contains: range(i++, i += 30),
			generateTile: weights([
				[20, tiles.air],
				[1, tiles.dirt],
				[1, tiles.stone],
			]),
		},
		{
			id: 'portals',
			name: 'portals',
			image: infoTexture,
			contains: range(i++, i),
			generateTile: weights([
				[1, tiles.homePortal],
			]),
		},
		{
			id: 'oob',
			name: 'oob',
			image: tiles.hangar.image,
			contains: () => true,
			generateTile: () => tiles.hangar,
		}
	],
	hangar: [
		{
			id: 'hangar',
			name: 'hangar',
			image: tiles.hangar.image,

			...structure(i = 0, template(
				{
					' ': tiles.air,
					'#': tiles.hangar,
					'b': tiles.box,
					'h': tiles.homePortal,
					'o': tiles.overworldPortal,
					'p': [tiles.whiteCurrency, tiles.whiteCurrency, tiles.greenCurrency, tiles.greenCurrency, tiles.blueCurrency, tiles.blueCurrency, tiles.purpleCurrency, tiles.purpleCurrency, tiles.magentaCurrency, tiles.magentaCurrency],
					's': [
						storePortal('whiteStore'),
						storePortal('whiteStore'),
						storePortal('greenStore'),
						storePortal('greenStore'),
						storePortal('blueStore'),
						storePortal('blueStore'),
						storePortal('purpleStore'),
						storePortal('purpleStore'),
						storePortal('magentaStore'),
						storePortal('magentaStore'),
					],
				}, [
				['o', ' ', ' ', ' ', 'o'],
				['#', ' ', ' ', ' ', '#'],
				['#', ' ', ' ', ' ', '#'],
				['s', 'p', ' ', 'p', 's'],
				['#', ' ', ' ', ' ', '#'],
				['#', ' ', ' ', ' ', '#'],
				['s', 'p', ' ', 'p', 's'],
				['#', ' ', ' ', ' ', '#'],
				['#', ' ', ' ', ' ', '#'],
				['s', 'p', ' ', 'p', 's'],
				['#', ' ', ' ', ' ', '#'],
				['#', ' ', ' ', ' ', '#'],
				['s', 'p', ' ', 'p', 's'],
				['#', ' ', ' ', ' ', '#'],
				['#', ' ', ' ', ' ', '#'],
				['s', 'p', ' ', 'p', 's'],
				['#', ' ', ' ', ' ', '#'],
				['#', ' ', ' ', ' ', '#'],
				['h', ' ', ' ', ' ', 'h'],
				['#', 'o', 'o', 'o', '#'],
			]
			))
		},
		{
			id: 'oob',
			name: 'oob',
			image: tiles.hangar.image,
			contains: () => true,
			generateTile: () => tiles.hangar,
		}
	],

	whiteStore: store({
		pipValue: 1,
		currency: tiles.whiteCurrency,
		id: 'whiteStore',
		name: 'White Store',
		items: [
			tiles.woodenShield,
			tiles.woodenShield,
			tiles.woodenShield,
			tiles.woodenShield,
			tiles.woodenShield,
			tiles.woodenShield,
			tiles.woodenShield,
		],
	}),

	overworld: [
		{
			id: 'spawn',
			name: 'Drop ship',
			image: skyTexture,
			background: skyTexture,
			contains: range(-Infinity, i = -1),
			generateTile: () => tiles.air,
		},
		{
			id: 'entrance',
			name: 'Entrance',
			image: tiles.dirt.image,
			contains: range(i++, i += 30),
			generateTile: weights([
				[50, tiles.dirt],
				[20, tiles.air],
				[10, tiles.stone],
			]),
		},
		{
			id: 'layer1',
			name: 'Rocky falls',
			image: tiles.stone.image,
			contains: range(i++, i += 70),
			generateTile: weights([
				[30, tiles.stone],
				[20, tiles.dirt],
				[10, tiles.air],
				[1, tiles.gold],
				[0.1, tiles.stoneSecret],
			]),
		},
		{
			id: 'layer1-depths',
			name: 'Rocky falls depths',
			image: tiles.stone.image,
			contains: range(i++, i += 100),
			generateTile: weights([
				[60, tiles.stone],
				[20, tiles.dirt],
				[10, tiles.air],
				[5, tiles.stone2],
				[2, tiles.gold],
				[0.1, tiles.stoneSecret],
			]),
		},
		{
			id: 'layer1-2-merger',
			name: 'Rocky ceiling',
			image: tiles.stone2.image,
			contains: range(i++, i += 200),
			generateTile: weights([
				[1, tiles.stone2],
			]),
		},
		{
			id: 'layer2-caverns',
			name: 'Stone Caverns',
			image: tiles.stone2.image,
			contains: range(i++, i += 350),
			generateTile: weights([
				[20, tiles.stone2],
				[20, tiles.air],
				[5, tiles.jungle],
				[1, tiles.diamond],
			]),
		},
		{
			id: 'layer3',
			name: 'layer 3',
			image: tiles.stone3.image,
			contains: range(i++, i += 500),
			generateTile: weights([
				[20, tiles.stone3],
				[20, tiles.air],
			]),
		},
		{
			id: 'layer4',
			name: 'layer 4',
			image: tiles.stone4.image,
			contains: range(i++, i += 1000),
			generateTile: weights([
				[20, tiles.stone4],
				[5, tiles.air],
				[1, tiles.fossil],
			]),
		},
		{
			id: 'layer5',
			name: 'layer 5',
			image: tiles.snow.image,
			contains: range(i++, i += 1700),
			generateTile: weights([
				[20, tiles.snow],
			]),
		},
		{
			id: 'layer5-ice',
			name: 'layer 5 ice',
			image: tiles.ice.image,
			contains: range(i++, i += 2500),
			generateTile: weights([
				[20, tiles.ice],
				[1, tiles.snow],
			]),
		},
	]
} as Record<string, Region[]>;