import currencyImage from '../assets/ui/gold.png';
import currencyPendingImage from '../assets/ui/goldPending.png';
import currencyBankImage from '../assets/ui/goldBank.png';
import { useGameState } from '../hooks/useGameState';
import NumberRenderer from './NumberRenderer';

const modes = ['both', 'pending', 'bank'];

function CurrencyGauge() {
	const [state, update] = useGameState();

	const currencyValues = {
		both: {
			value: state.currency + state.pendingCurrency,
			image: currencyImage,
		},
		pending: {
			value: state.pendingCurrency,
			image: currencyPendingImage,
		},
		bank: {
			value: state.currency,
			image: currencyBankImage,
		},
	};

	const { value, image } =
		currencyValues[state.preferences.currencyDisplay ?? 'both'];

	const handleClick = () => {
		update((state) => {
			let idx = modes.indexOf(
				state.preferences.currencyDisplay ?? 'both'
			);
			idx += 1;
			idx %= modes.length;

			const newMode = modes[idx];

			state.preferences.currencyDisplay = newMode as any;
		});
	};

	return (
		<div className='flex flex-col-reverse [grid-column:3] [grid-row:2] bg-black'>
			<img
				src={image}
				className='w-[64px] h-[64px] [image-rendering:pixelated]'
				role='button'
				onClick={handleClick}
			/>
			<NumberRenderer
				value={value}
				orientation='vertical'
				style={{
					transform: 'scaleY(-1)',
				}}
			/>
		</div>
	);
}

export default CurrencyGauge;
