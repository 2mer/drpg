export function block<T extends () => any>(fn: T) {
	return fn();
}