import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { ITile } from '../logic/world/tiles';
import checkIcon from '../assets/ui/check.png';

function ShopIndication({ tile }: { tile: ITile }) {
	const [state] = useGameState();

	if (!state.upgrades.includes(tile.id)) return null;

	return (
		<motion.img
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			src={checkIcon}
			className='absolute inset-0  z-30 w-full h-full [image-rendering:pixelated]'
			style={{ filter: 'drop-shadow(0 0 4px white)' }}
		/>
	);
}

export default ShopIndication;
