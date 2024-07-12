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

			function moveToPos({ canGainMomentum = true } = {}) {
				if (world.emit('tryMove', { ...newPos, preventDefault: false }).preventDefault) return;

				if (newPos.x < 0) return;
				if (newPos.x > 4) return;

				if (canGainMomentum && newPos.y > state.position.y) {
					state.velocity++;
				}


				if (!world.emit('move', { ...newPos, preventDefault: false }).preventDefault) {
					posTransformer(state.position);
				}
			}

			const tile = world.at(newPos.x, newPos.y);
			if (tile.toughness > 0) {
				if (state.velocity < 1) return;

				if (world.emit('damage', { ...newPos, preventDefault: false, tile }).preventDefault) return;

				let newTile = { ...tile };
				newTile.toughness--;
				state.velocity--;

				if (newTile.toughness === 0) {
					if (world.emit('break', { ...newPos, preventDefault: false, tile: newTile }).preventDefault) return;

					state.pendingCurrency += tile.score;

					newTile = tiles.air;
					moveToPos({ canGainMomentum: false });
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
		['ArrowDown', goDown],
		['space', goDown],

		['a', goLeft],
		['ArrowLeft', goLeft],

		['d', goRight],
		['ArrowRight', goRight],
	]);
}