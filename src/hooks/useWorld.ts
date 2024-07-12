import { createContext } from "@sgty/kontext-react";
import { useGameState } from "./useGameState";
import { useEffect, useMemo } from "react";
import { generateTile } from "../logic/world/generation";
import tiles, { ITile } from "../logic/world/tiles";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../logic/world/constants";
import EventEmitter from "eventemitter3";

export function hashPos(x: number, y: number) {
	return `${x}_${y}`;
}

export type WorldEvents = {
	move: (e: { x: number, y: number, preventDefault: boolean }) => void;
	tryMove: (e: { x: number, y: number, preventDefault: boolean }) => void;
	damage: (e: { x: number, y: number, preventDefault: boolean, tile: ITile }) => void;
	break: (e: { x: number, y: number, preventDefault: boolean, tile: ITile }) => void;
}

export const WorldContext = createContext(() => {
	const [state, update] = useGameState();

	const world = useMemo(() => {

		const events = new EventEmitter<WorldEvents>();

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
			}),

			events,

			emit<T extends keyof WorldEvents>(name: T, payload: Parameters<WorldEvents[T]>[0]) {
				events.emit(name, payload as any);

				return payload;
			}
		};
	}, [state]);

	useEffect(() => {
		if (!world) return;

		world.events.on('move', (e) => {
			const { x, y } = e;
			const tile = world.at(x, y);


			if (tile.id === tiles.homePortal.id) {
				e.preventDefault = true;

				update(state => {
					state.position.x = 2;
					state.position.y = -5;
					state.velocity = 0;
					state.run++;
					state.world = {};
					state.currency += state.pendingCurrency;
					state.pendingCurrency = 0;
				})

				return;
			}
		})
	}, [world])

	return world;
})

export const useWorld = WorldContext.use;