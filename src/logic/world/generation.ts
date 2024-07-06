import { WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import { R21 } from "./random";
import tiles, { ITile } from "./tiles";

export function getWeighted<T>(r: number, entries: ([weight: number, item: T])[]): T {
	const totalWeight = entries.reduce((sum, [weight]) => sum + weight, 0);
	let random = r * totalWeight;

	for (const [weight, item] of entries) {
		random -= weight;
		if (random <= 0) {
			return item;
		}
	}

	// Fallback in case of rounding errors
	return entries[entries.length - 1][1];
}

export function generateTile(x: number, y: number): ITile {

	if (y < 0) return tiles.air;

	if (y < 30) return getWeighted(R21(x, y), [
		[50, tiles.dirt],
		[20, tiles.air],
		[1, tiles.box],
	]);

	if (y < 100) return getWeighted(R21(x, y), [
		[30, tiles.stone],
		[20, tiles.dirt],
		[10, tiles.air],
		[5, tiles.box],
	]);

	return getWeighted(R21(x, y), [
		[60, tiles.stone],
		[20, tiles.dirt],
		[10, tiles.air],
		[5, tiles.box],
	]);
}

export function generateDepth(y: number, width: number = WORLD_WIDTH) {
	return Array(width).fill(null).map((_, i) => generateTile(i, y));
}

export function generateRange(y: number, height: number = WORLD_HEIGHT) {
	return Array(height).fill(null).map((_, i) => generateDepth(y + i))
}