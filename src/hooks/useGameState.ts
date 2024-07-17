import { useLocalStorage } from "@mantine/hooks"
import { produce } from "immer"
import { useCallback } from "react"
import { ITile } from "../logic/world/tiles";

export type GameState = {
	currency: number,
	pendingCurrency: number,
	upgrades: string[],
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

export function useGameState() {
	const [state, setState] = useLocalStorage<GameState>({
		key: 'drpg-game-state',
		getInitialValueInEffect: false,
		defaultValue: {
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
	})

	const update = useCallback((transform: (state: GameState) => void) => setState(prev => produce(prev, transform)), [setState]);

	return [state, update] as const;
}