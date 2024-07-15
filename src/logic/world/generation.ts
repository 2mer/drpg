import { WORLD_HEIGHT, WORLD_WIDTH } from "./constants";
import regions from "./regions";
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

export function regionAt(dimension: string, x: number, y: number) {
	return regions[dimension].find(r => r.contains(x, y));
}

export function generateTile(dimension: string, x: number, y: number): ITile {

	const matchingRegion = regionAt(dimension, x, y);

	if (!matchingRegion) return tiles.air;

	return matchingRegion.generateTile(x, y);
}

export function generateDepth(dimension: string, y: number, width: number = WORLD_WIDTH) {
	return Array(width).fill(null).map((_, i) => generateTile(dimension, i, y));
}

export function generateRange(dimension: string, y: number, height: number = WORLD_HEIGHT) {
	return Array(height).fill(null).map((_, i) => generateDepth(dimension, y + i))
}