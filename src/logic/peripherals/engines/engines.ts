import { range } from "radash";
import { hashPos } from "../../../hooks/useWorld";
import tiles from "../../world/tiles";
import { PeripheralFactory } from "../peripheral";

export const EnginesFactory = PeripheralFactory(internals => {
	function tryGo(posTransformer: (pos: { x: number, y: number }) => void) {
		const { world, update } = internals;

		update((state) => {
			const { dimension } = state;
			const newPos = { ...state.position };
			posTransformer(newPos);

			internals.checkLock();

			function moveToPos({ canGainMomentum = true } = {}) {
				if (world.emit('tryMove', { ...newPos, dimension, preventDefault: false }).preventDefault) return;

				if (newPos.x < 0) return;
				if (newPos.x > 4) return;

				if (canGainMomentum && newPos.y > state.position.y) {
					state.velocity += state.stats.weight;
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

		return internals.lock();
	}

	function xTimes(fn: () => Promise<void>) {
		return async (n: number = 1) => {
			for (const i of range(0, n - 1)) {
				await fn();
			}
		}
	}

	const down = xTimes(() => tryGo((pos) => { pos.y++; }));
	const left = xTimes(() => tryGo((pos) => { pos.x-- }));
	const right = xTimes(() => tryGo((pos) => { pos.x++ }));

	return {
		down,
		left,
		right
	}
});

export type Engines = ReturnType<typeof EnginesFactory>;