import { useLocalStorage } from "@mantine/hooks"
import { produce } from "immer"
import { useCallback, useEffect } from "react"
import { ITile } from "../logic/world/tiles";
import { PeripheralId } from "../logic/peripherals/registry";

export type GameState = {
	version: string,
	currency: number,
	pendingCurrency: number,
	upgrades: string[],
	peripherals: PeripheralId[],
	dimension: string,
	position: { x: number, y: number },
	velocity: number;
	falling: boolean,
	run: number,
	stats: {
		armor: number,
		startingY: number,
		weight: number,
		generation: number,
	}
	world: { [key: string]: ITile },
	preferences: {
		currencyDisplay?: 'both' | 'bank' | 'pending',
	},
}

export const STORAGE_KEY = 'drpg-game-state';
export const GAME_VERSION = 'v1.0.0';

const defaultState: GameState = {
	version: GAME_VERSION,
	peripherals: [
		'engines', 'system'
	],
	stats: {
		armor: 0,
		startingY: -3,
		weight: 1,
		generation: 0,
	},
	dimension: 'tutorial',
	currency: 0,
	pendingCurrency: 0,
	run: 0,
	falling: false,
	position: { x: 2, y: -5 },
	upgrades: [],
	velocity: 0,
	world: {},
	preferences: {},
}

export function useGameState() {
	const [state, setState] = useLocalStorage<GameState>({
		key: STORAGE_KEY,
		getInitialValueInEffect: false,
		defaultValue: defaultState
	})

	useEffect(() => {
		if (state.version !== defaultState.version) {
			setState(defaultState);
		}
	}, [])

	const update = useCallback((transform: (state: GameState) => void) => setState(prev => produce(prev, transform)), [setState]);

	return [state, update] as const;
}