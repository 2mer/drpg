import { hashPos } from "../../../hooks/useWorld";
import tiles from "../../world/tiles";
import { PeripheralFactory } from "../peripheral";

export const SystemFactory = PeripheralFactory(internals => {

	function createPortal(location: string = 'hangar') {
		const { world, state, update } = internals;
		if (
			world.at(state.dimension, state.position.x, state.position.y + 1)
				.id !== tiles.air.id
		)
			return;

		if (location !== 'hangar') throw new Error('Warp Drive Exception: Cannot initiate warp to an unknown location')

		update((state) => {
			state.world[hashPos(state.position.x, state.position.y + 1)] =
				tiles.homePortal;
		});
	}

	function destory() {
		const { update } = internals;

		update((state) => {
			state.position.x = tiles.homePortal.portalTo.x;
			state.position.y = tiles.homePortal.portalTo.y;
			state.dimension = tiles.homePortal.portalTo.dimension;
			state.world = {};
			state.run++;
			state.velocity = 0;
			state.pendingCurrency = 0;
		});
	}

	return {
		createPortal,
		destory,
	}
});

export type System = ReturnType<typeof SystemFactory>;