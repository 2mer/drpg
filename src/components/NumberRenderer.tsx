import React from 'react';
import { twJoin } from 'tailwind-merge';

const TILES = 4;
const SIZE_SCREEN = 64 * TILES;
const SIZE_PIXELS = 9 * TILES;
export const BARS = SIZE_PIXELS / 2;
const PX = SIZE_SCREEN / SIZE_PIXELS;

const PALLETTE = [
	'transparent',
	'white',
	'#99e550',
	'#5b6ee1',
	'#b86fd4',
	'#dc49b6',
	'#d95763',
	'#df7126',
];

export function tierPip(tier: number) {
	return Math.pow(BARS, tier);
}

export type Orientation = 'horizontal' | 'vertical';
export type OverflowStrategy = 'clamp' | 'cyclic';

const directions = {
	horizontal: 'to right',
	vertical: 'to bottom',
};

function nearestBasePower(value: number, base: number): number {
	if (value <= 0) return 0;

	if (base <= 1) {
		throw new Error(
			'Value must be greater than 0 and base must be greater than 1.'
		);
	}

	let power = 1;
	while (base ** power <= value) {
		power++;
	}
	return power - 1;
}

function NumberRenderer({
	value,
	orientation,
	style,
	overflow = 'clamp',
}: {
	value: number;
	orientation: Orientation;
	style?: React.CSSProperties;
	overflow?: OverflowStrategy;
}) {
	const clamped = Math.max(0, value);
	const nearestPow = nearestBasePower(clamped, BARS);
	const nextThreshold = Math.pow(BARS, nearestPow + 1);
	let d = nearestPow;
	let r = Math.floor((clamped / nextThreshold) * BARS);

	if (d > PALLETTE.length - 1) {
		if (overflow === 'clamp') {
			d = PALLETTE.length - 1;
			r = BARS;
		} else {
			d %= PALLETTE.length - 1;
		}
	}

	const bgColor = 'transparent';
	const fgColor = PALLETTE[d + 1];

	function createGradient(bars: number, bg: boolean) {
		const style = {
			backgroundImage: `linear-gradient(${directions[orientation]}, ${
				bg ? bgColor : fgColor
			} 50%, transparent 50%)`,

			...(orientation === 'horizontal'
				? {
						top: 0,
						left: 0,
						width: `${Math.floor((bars / BARS) * 100)}%`,
						height: '100%',
						backgroundRepeat: 'repeat-x',
						backgroundSize: `${PX * 2}px 64px`,
				  }
				: {
						top: 0,
						left: 0,
						height: `${Math.floor((bars / BARS) * 100)}%`,
						width: '100%',
						backgroundRepeat: 'repeat-y',
						backgroundSize: `64px ${PX * 2}px`,
				  }),
		};

		return style;
	}

	return (
		<div
			className={twJoin(
				'relative bg-black flex justify-stretch items-stretch',
				orientation === 'horizontal'
					? 'w-[calc(64px*4)] h-[64px]'
					: 'w-[64px] h-[calc(64px*4)]'
			)}
			style={{
				...style,
				...(orientation === 'horizontal'
					? { padding: `${PX}px 0` }
					: { padding: `0 ${PX}px` }),
			}}
		>
			<div className='flex-1 relative'>
				{/* bg */}
				<div
					className='absolute'
					style={{ ...createGradient(BARS, true) }}
				/>
				{/* fg */}
				<div
					className='absolute'
					style={{ ...createGradient(r, false) }}
				/>
			</div>
		</div>
	);
}

export default NumberRenderer;
