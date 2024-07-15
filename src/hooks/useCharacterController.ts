import { useHotkeys } from "@mantine/hooks";
import { useGameState } from "./useGameState";
import { hashPos, useWorld } from "./useWorld";
import tiles from "../logic/world/tiles";

export default function useCharacterController() {
	const [state, update] = useGameState();
	const world = useWorld();

	function tryGo(posTransformer: (pos: { x: number, y: number }) => void) {
		update((state) => {
			const { dimension } = state;
			const newPos = { ...state.position };
			posTransformer(newPos);

			function moveToPos({ canGainMomentum = true } = {}) {
				if (world.emit('tryMove', { ...newPos, dimension, preventDefault: false }).preventDefault) return;

				if (newPos.x < 0) return;
				if (newPos.x > 4) return;

				if (canGainMomentum && newPos.y > state.position.y) {
					state.velocity++;
				}


				if (!world.emit('move', { ...newPos, dimension, preventDefault: false }).preventDefault) {
					posTransformer(state.position);
				}
			}

			const tile = world.at(dimension, newPos.x, newPos.y);
			if (tile.toughness > 0) {
				if (state.velocity < 1) return;

				if (world.emit('damage', { ...newPos, dimension, preventDefault: false, tile }).preventDefault) return;

				let newTile = { ...tile };
				newTile.toughness--;
				state.velocity--;

				if (newTile.toughness === 0) {
					if (world.emit('break', { ...newPos, dimension, preventDefault: false, tile: newTile }).preventDefault) return;

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

	const interact = () => {
		const tile = world.at(state.dimension, state.position.x, state.position.y, true);
		world.emit('interact', { dimension: state.dimension, x: state.position.x, y: state.position.y, tile, preventDefault: false });
	};
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

		['w', interact],
		['ArrowUp', interact],
	]);
}