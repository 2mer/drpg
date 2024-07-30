import { PeripheralFactory } from "../peripheral";

export const GpsFactory = PeripheralFactory(internals => {

	return {
		get position() {
			return internals.state.position;
		},

		getPosition() {
			return internals.state.position;
		}
	}
})

export type Gps = ReturnType<typeof GpsFactory>;