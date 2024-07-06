import { useLocalStorage } from "@mantine/hooks"
import { produce } from "immer"
import { useCallback } from "react"
import { ITile } from "../logic/world/tiles";

export type GameState = {
	currency: number,
	upgrades: [],
	position: { x: number, y: number },
	velocity: number;
	falling: boolean,
	world: { [key: string]: ITile }
}

export function useGameState() {
	const [state, setState] = useLocalStorage<GameState>({
		key: 'drpg-game-state',
		getInitialValueInEffect: false,
		defaultValue: {
			currency: 0,
			falling: false,
			position: { x: 2, y: -5 },
			upgrades: [],
			velocity: 0,
			world: {},
		}
	})

	const update = useCallback((transform: (state: GameState) => void) => setState(prev => produce(prev, transform)), [setState]);

	return [state, update] as const;
}