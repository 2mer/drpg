import { PropsWithChildren } from 'react';
import buttonDeck from '../assets/ui/buttonDeck.png';
import buttonDeckDanger from '../assets/ui/buttonDeckDanger.png';
import exitButtonImage from '../assets/ui/exit.png';
import portalButtonImage from '../assets/ui/portal.png';
import { useHotkeys } from '@mantine/hooks';
import { PX_RES } from '../constants';
import { usePeripheral } from '../hooks/usePeripheral';

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
		<div className='w-res h-res relative'>
			<img
				className='w-res h-res [image-rendering:pixelated] absolute inset-0'
				src={image}
			/>

			<div className='absolute inset-0'>{children}</div>
		</div>
	);
};

function ActionBar() {
	const system = usePeripheral('system');

	useHotkeys([
		['r', () => system.destory()],
		['e', () => system.createPortal()],
	]);

	return (
		<div className='[grid-column:2] [grid-row:3] flex'>
			<div
				className='flex-1 [image-rendering:pixelated]'
				style={{
					backgroundImage: `url("${buttonDeck}")`,
					backgroundRepeat: 'repeat',
					backgroundSize: PX_RES,
				}}
			/>
			<ButtonDeck>
				<img
					className='w-res h-res [image-rendering:pixelated]'
					src={portalButtonImage}
					role='button'
					onClick={() => system.createPortal()}
				/>
			</ButtonDeck>

			<ButtonDeck variant='danger'>
				<img
					className='w-res h-res [image-rendering:pixelated]'
					src={exitButtonImage}
					role='button'
					onClick={() => system.destory()}
				/>
			</ButtonDeck>
		</div>
	);
}

export default ActionBar;
