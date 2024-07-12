import React from 'react';
import { twJoin } from 'tailwind-merge';

const TILES = 4;
const SIZE_SCREEN = 64 * TILES;
const SIZE_PIXELS = 9 * TILES;
const BARS = SIZE_PIXELS / 2;
const PX = SIZE_SCREEN / SIZE_PIXELS;

const PALLETTE = [
	'transparent',
	'white',
	'lime',
	'green',
	'blue',
	'purple',
	'magenta',
	'orange',
	'red',
];

export type Orientation = 'horizontal' | 'vertical';
export type OverflowStrategy = 'clamp' | 'cyclic';

const directions = {
	horizontal: 'to left',
	vertical: 'to bottom',
};

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
	let d = Math.floor(clamped / BARS);
	let r = clamped % BARS;

	if (d > PALLETTE.length - 1) {
		if (overflow === 'clamp') {
			d = PALLETTE.length - 1;
			r = BARS;
		} else {
			d %= PALLETTE.length - 1;
		}
	}

	const bgColor = PALLETTE[d];
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
						width: `${Math.round((bars / BARS) * 100)}%`,
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
