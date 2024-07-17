export function block<T extends () => any>(fn: T) {
	return fn();
}

export type ValueOrCompute<T, TCompute extends (...args: any) => T = (p: T) => T> = T | TCompute;
export type ValueOrComputeHandler<T extends ValueOrCompute<any, any>> = T extends ValueOrCompute<any, infer R> ? R : never;
export function handleValueOrCompute<T extends ValueOrCompute<any, any>>(v: T, ...rest: Parameters<ValueOrComputeHandler<T>>) {
	if (typeof v === 'function') return v(...rest);

	return v;
}