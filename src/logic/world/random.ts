import { dot, fract, vec2 } from "./math";

export function R21(n1: number, n2: number) {

	return Math.abs(fract(
		Math.sin(
			dot(
				vec2(n1, n2),
				vec2(12.9898, 78.233)
			)
		) *
		43758.5453123
	));
}

export function R11(n1: number) {
	return R21(n1, -2342.5975)
}