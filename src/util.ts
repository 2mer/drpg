export function block<T extends () => any>(fn: T) {
	return fn();
}

export type ValueOrCompute<T, TCompute extends (...args: any) => T = (p: T) => T> = T | TCompute;
export type ValueOrComputeHandler<T extends ValueOrCompute<any, any>> = T extends ValueOrCompute<any, infer R> ? R : never;
export function handleValueOrCompute<T extends ValueOrCompute<any, any>>(v: T, ...rest: Parameters<ValueOrComputeHandler<T>>) {
	if (typeof v === 'function') return v(...rest);

	return v;
}

export class Point {
	// Properties for the x and y coordinates
	x: number;
	y: number;

	// Constructor to initialize the point
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	// Method to calculate the distance to another point
	distanceTo(other: Point): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// Method to add another point to this point
	add(x: number, y?: number): Point;
	add(other: Point): Point;
	add(...args: any[]): Point {
		const [otherOrX, y = otherOrX] = args;

		if (otherOrX instanceof Point) {
			return new Point(this.x + otherOrX.x, this.y + otherOrX.y);
		}

		return new Point(this.x + otherOrX, this.y + y);
	}

	equals(x: number, y?: number): boolean;
	equals(other: Point): boolean;
	equals(...args: any[]): boolean {
		const [otherOrX, y = otherOrX] = args;

		if (otherOrX instanceof Point) {
			return this.x === otherOrX.x && this.y === otherOrX.y;
		}

		return this.x === otherOrX && this.y === y;
	}

	// Method to subtract another point from this point
	subtract(other: Point): Point {
		return new Point(this.x - other.x, this.y - other.y);
	}

	// Method to scale this point by a factor
	scale(factor: number): Point {
		return new Point(this.x * factor, this.y * factor);
	}

	// Method to get a string representation of the point
	toString(): string {
		return `(${this.x}, ${this.y})`;
	}
}