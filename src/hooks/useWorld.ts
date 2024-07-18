import { createContext } from "@sgty/kontext-react";
import { useGameState } from "./useGameState";
import { useEffect, useMemo } from "react";
import { generateTile } from "../logic/world/generation";
import tiles, { isInteractive, isPortal, isShop, ITile } from "../logic/world/tiles";
import { WORLD_HEIGHT, WORLD_HEIGHT_PAD, WORLD_WIDTH } from "../logic/world/constants";
import EventEmitter from "eventemitter3";
import { handleValueOrCompute } from "../util";

export function hashPos(x: number, y: number) {
	return `${x}_${y}`;
}

export type WorldEvents = {
	move: (e: { dimension: string, x: number, y: number, preventDefault: boolean }) => void;
	tryMove: (e: { dimension: string, x: number, y: number, preventDefault: boolean }) => void;
	damage: (e: { dimension: string, x: number, y: number, preventDefault: boolean, tile: ITile }) => void;
	break: (e: { dimension: string, x: number, y: number, preventDefault: boolean, tile: ITile }) => void;
	interact: (e: { dimension: string, x: number, y: number, preventDefault: boolean, tile: ITile }) => void;
}

export const WorldContext = createContext(() => {
	const [state, update] = useGameState();

	const world = useMemo(() => {

		const events = new EventEmitter<WorldEvents>();

		function at(dimension: string, x: number, y: number, ignorePlayer = false) {
			if (!ignorePlayer && (x === state.position.x) && (y === state.position.y)) return tiles.drill;

			const hashed = state.world[hashPos(x, y)];
			if (hashed) return hashed;

			return generateTile(dimension, x, y);
		}

		return {
			at,
			tiles: Array(WORLD_HEIGHT + WORLD_HEIGHT_PAD * 2).fill(null).map((_, iY) => {
				return Array(WORLD_WIDTH).fill(null).map((_, iX) => at(state.dimension, iX, state.position.y + iY - WORLD_HEIGHT_PAD, true))
			}),
			playerTile: at(state.dimension, state.position.x, state.position.y),

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
			const { x, y, dimension } = e;
			const tile = world.at(dimension, x, y);

			if (isPortal(tile)) {
				const { portalTo } = tile;

				e.preventDefault = true;

				update(state => {
					state.position.x = handleValueOrCompute(portalTo.x, state);
					state.position.y = handleValueOrCompute(portalTo.y, state);
					state.velocity = 0;
					state.run++;
					state.world = {};
					state.currency += state.pendingCurrency;
					state.pendingCurrency = 0;
					state.dimension = portalTo.dimension;
				})

				return;
			}

			if (y % 10 === 0) {
				update(state => {
					state.velocity += state.stats.generation;
				})
			}
		})

		world.events.on('interact', (e) => {
			const { tile } = e;

			if (isShop(tile)) {
				if (state.currency < tile.price) return;
				if (state.upgrades.includes(tile.id)) return;

				update(state => {
					tile.onBuy(state);
					state.upgrades.push(tile.id);
					state.currency -= tile.price;
				})
				return;
			}

			if (isInteractive(tile)) {
				update(state => {
					tile.onInteract(state);
				})
			}
		})

		return () => {
			world.events.removeAllListeners();
		}
	}, [world])

	return world;
})

export const useWorld = WorldContext.use;