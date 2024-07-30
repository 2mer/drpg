import { usePeripheralInternals } from "../../hooks/usePeripheralInternals";

export type PeripheralInternals = ReturnType<typeof usePeripheralInternals>

export function PeripheralFactory<T extends (internals: PeripheralInternals) => any>(def: T) {
	return def;
}