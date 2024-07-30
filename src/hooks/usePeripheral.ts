import { getPeripheralFactory, Peripheral, PeripheralId } from "../logic/peripherals/registry";
import { useConst } from "./useConst";
import { usePeripheralInternals } from "./usePeripheralInternals";

export function usePeripheral<T extends PeripheralId>(id: T): Peripheral<T> {
	const internals = usePeripheralInternals();

	// @ts-ignore
	return useConst(() => getPeripheralFactory<T>(id)(internals))
}