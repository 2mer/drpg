import { EnginesFactory } from "./engines/engines";
import { GpsFactory } from "./sensors/gps";
import { SystemFactory } from "./system/warpDrive";

const registry = {

	engines: EnginesFactory,
	gps: GpsFactory,
	system: SystemFactory,

} as const;

export function getPeripheralFactory<T extends PeripheralId>(id: T): (typeof registry)[T] {
	return registry[id];
}

export type PeripheralId = keyof typeof registry
export type Peripherals = { [key in PeripheralId]: ReturnType<(typeof registry)[key]> }
export type Peripheral<T extends PeripheralId> = Peripherals[T];