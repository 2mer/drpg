import { useAsRef } from "./useAsRef";
import { useConst } from "./useConst";
import { useGameState } from "./useGameState";
import { useWorld } from "./useWorld";

export function usePeripheralInternals() {
	const [state, update] = useGameState();
	const world = useWorld();

	const stateRef = useAsRef(state);
	const worldRef = useAsRef(world);

	const lockState = useConst(() => ({ locked: false }))

	return useConst(() => {

		function checkLock() {
			if (lockState.locked) throw new Error('Resource Lock: System is busy!')
		}

		return ({
			get state() {
				return stateRef.current
			},

			get world() {
				return worldRef.current
			},

			update,

			checkLock,

			// lock(timeMS = 250) {
			lock(timeMS = 2250) {
				checkLock();

				return new Promise<void>((resolve) => {
					lockState.locked = true;

					setTimeout(() => {
						lockState.locked = false;
						resolve();
					}, timeMS)
				})
			},
		})
	})
}