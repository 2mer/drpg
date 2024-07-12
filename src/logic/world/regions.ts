import { getWeighted } from "./generation";
import { R21 } from "./random";
import tiles, { ITile } from "./tiles";

export type Region = {
	id: string;
	image: string;
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

export default [
	{
		id: 'spawn',
		name: 'Drop ship',
		image: tiles.air.image,
		contains: range(-Infinity, -1),
		generateTile: () => tiles.air,
	},
	{
		id: 'entrance',
		name: 'Entrance',
		image: tiles.dirt.image,
		contains: range(0, 30),
		generateTile: weights([
			[50, tiles.dirt],
			[20, tiles.air],
			[1, tiles.box],
		]),
	},
	{
		id: 'layer1',
		name: 'Rocky falls',
		image: tiles.stone.image,
		contains: range(31, 100),
		generateTile: weights([
			[30, tiles.stone],
			[20, tiles.dirt],
			[10, tiles.air],
			[1, tiles.box],
		]),
	},
	{
		id: 'layer1-depths',
		name: 'Rocky falls depths',
		image: tiles.stone.image,
		contains: range(101, Infinity),
		generateTile: weights([
			[60, tiles.stone],
			[20, tiles.dirt],
			[10, tiles.air],
			[5, tiles.box],
		]),
	},
] satisfies Region[];