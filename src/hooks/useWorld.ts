import { createContext } from "@sgty/kontext-react";
import { useGameState } from "./useGameState";
import { useMemo } from "react";
import { generateTile } from "../logic/world/generation";
import tiles from "../logic/world/tiles";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../logic/world/constants";

export function hashPos(x: number, y: number) {
	return `${x}_${y}`;
}

export const WorldContext = createContext(() => {
	const [state] = useGameState();

	const world = useMemo(() => {

		function at(x: number, y: number) {
			if ((x === state.position.x) && (y === state.position.y)) return tiles.drill;

			const hashed = state.world[hashPos(x, y)];
			if (hashed) return hashed;

			return generateTile(x, y);
		}

		return {
			at,
			tiles: Array(WORLD_HEIGHT).fill(null).map((_, iY) => {
				return Array(WORLD_WIDTH).fill(null).map((_, iX) => at(iX, state.position.y + iY))
			})
		};
	}, [state]);

	return world;
})

export const useWorld = WorldContext.use;