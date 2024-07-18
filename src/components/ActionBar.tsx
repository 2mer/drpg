import { PropsWithChildren } from 'react';
import buttonDeck from '../assets/ui/buttonDeck.png';
import buttonDeckDanger from '../assets/ui/buttonDeckDanger.png';
import exitButtonImage from '../assets/ui/exit.png';
import portalButtonImage from '../assets/ui/portal.png';
import { useGameState } from '../hooks/useGameState';
import { hashPos, useWorld } from '../hooks/useWorld';
import tiles from '../logic/world/tiles';
import { useHotkeys } from '@mantine/hooks';

const DECK_VARIANTS = {
	standard: buttonDeck,
	danger: buttonDeckDanger,
} as const;
const ButtonDeck = ({
	children,
	variant = 'standard',
}: PropsWithChildren<{ variant?: keyof typeof DECK_VARIANTS }>) => {
	const image = DECK_VARIANTS[variant];

	return (
		<div className='w-[64px] h-[64px] relative'>
			<img
				className='w-[64px] h-[64px] [image-rendering:pixelated] absolute inset-0'
				src={image}
			/>

			<div className='absolute inset-0'>{children}</div>
		</div>
	);
};

function ActionBar() {
	const [state, update] = useGameState();
	const world = useWorld();

	function reset() {
		update((state) => {
			state.position.x = tiles.homePortal.portalTo.x;
			state.position.y = tiles.homePortal.portalTo.y;
			state.dimension = tiles.homePortal.portalTo.dimension;
			state.world = {};
			state.run++;
			state.velocity = 0;
			state.pendingCurrency = 0;
		});
	}

	function openPortal() {
		if (
			world.at(state.dimension, state.position.x, state.position.y + 1)
				.id !== tiles.air.id
		)
			return;

		update((state) => {
			state.world[hashPos(state.position.x, state.position.y + 1)] =
				tiles.homePortal;
		});
	}

	useHotkeys([
		['r', reset],
		['e', openPortal],
	]);

	return (
		<div className='[grid-column:2] [grid-row:3] flex'>
			<div
				className='flex-1 [image-rendering:pixelated]'
				style={{
					backgroundImage: `url("${buttonDeck}")`,
					backgroundRepeat: 'repeat',
					backgroundSize: '64px',
				}}
			/>
			<ButtonDeck>
				<img
					className='w-[64px] h-[64px] [image-rendering:pixelated]'
					src={portalButtonImage}
					role='button'
					onClick={openPortal}
				/>
			</ButtonDeck>

			<ButtonDeck variant='danger'>
				<img
					className='w-[64px] h-[64px] [image-rendering:pixelated]'
					src={exitButtonImage}
					role='button'
					onClick={reset}
				/>
			</ButtonDeck>
		</div>
	);
}

export default ActionBar;
