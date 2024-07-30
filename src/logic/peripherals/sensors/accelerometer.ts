import { PeripheralFactory } from "../peripheral";

export const AccelerometerFactory = PeripheralFactory(internals => {

	return {
		get velocity() {
			return internals.state.velocity;
		},

		getVelocity() {
			return internals.state.velocity;
		}
	}
})

export type Accelerometer = ReturnType<typeof AccelerometerFactory>;