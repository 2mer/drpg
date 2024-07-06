import { useHotkeys } from "@mantine/hooks";
import { useGameState } from "./useGameState";
import { hashPos, useWorld } from "./useWorld";
import tiles from "../logic/world/tiles";

export default function useCharacterController() {
	const [, update] = useGameState();
	const world = useWorld();

	function tryGo(posTransformer: (pos: { x: number, y: number }) => void) {
		update((state) => {
			const newPos = { ...state.position };
			posTransformer(newPos);

			function moveToPos() {
				if (newPos.y > state.position.y) {
					state.velocity++;
				}

				posTransformer(state.position);
			}

			const tile = world.at(newPos.x, newPos.y);
			if (tile.toughness > 0) {
				if (state.velocity < 1) return;

				let newTile = { ...tile };
				newTile.toughness--;
				state.velocity--;

				if (newTile.toughness === 0) {
					newTile = tiles.air;
					moveToPos();
				}

				state.world[hashPos(newPos.x, newPos.y)] = newTile;
			} else {
				moveToPos();
			}
		})
	}

	const goDown = () => tryGo((pos) => { pos.y++; });
	const goLeft = () => tryGo((pos) => { pos.x-- });
	const goRight = () => tryGo((pos) => { pos.x++ });

	useHotkeys([
		['s', goDown],
		['down', goDown],
		['space', goDown],

		['a', goLeft],
		['left', goLeft],

		['d', goRight],
		['right', goRight],
	]);
}